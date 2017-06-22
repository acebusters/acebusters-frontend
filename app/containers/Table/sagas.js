/**
 * Created by helge on 25.01.17.
 */
import ethUtil from 'ethereumjs-util';
import { call, put, takeEvery, select, fork, take } from 'redux-saga/effects';
import Raven from 'raven-js';
import { PokerHelper, ReceiptCache } from 'poker-helper';

import {
  setCards,
  addMessage,
  updateReceived,
  bet,
  show,
  net,
  receiptSet,
  pay,
  sitOutToggle,
  preToggleSitout,
  BET,
  FOLD,
  CHECK,
  SHOW,
  NET,
  HAND_REQUEST,
  UPDATE_RECEIVED,
  SEND_MESSAGE,
} from './actions';

import {
  makeSelectPrivKey,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';

import {
  makeMyCardsSelector,
} from '../Seat/selectors';
import {
  lastAmountByAction,
  isSbTurnByAction,
  isBbTurnByAction,
  is0rTurnByAction,
  isShowTurnByAction,
  hasNettingInAction,
  makeSbSelector,
  makeLatestHandSelector,
  makeLineupSelector,
  makeHandSelector,
  makeSelectWinners,
} from './selectors';

import TableService, { getHand } from '../../services/tableService';
import { nickNameByAddress } from '../../services/nicknames';
import { formatNtz } from '../../utils/amountFormater';
import * as storageService from '../../services/sessionStorage';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

export function* handRequest(action) {
  try {
    const tableState = yield call(getHand, action.tableAddr, action.handId);
    yield put(updateReceived(action.tableAddr, tableState));
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}


export function* submitSignedNetting(action) {
  try {
    // TODO(ab): check against actual balances here

    // sign balances here
    let payload = new Buffer(action.balances.replace('0x', ''), 'hex');
    const priv = new Buffer(action.privKey.replace('0x', ''), 'hex');
    const hash = ethUtil.sha3(payload);
    const sig = ethUtil.ecsign(hash, priv);
    payload = `0x${sig.r.toString('hex')}${sig.s.toString('hex')}${sig.v.toString(16)}`;
    const table = new TableService(action.tableAddr, action.privKey);
    yield table.net(action.handId, payload);
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}

export function* payFlow() {
  while (true) { //eslint-disable-line
    const req = yield take(pay.REQUEST);
    const action = req.payload;
    const table = new TableService(action.tableAddr, action.privKey);

    try {
      const wholeState = yield select();
      const tableAddr = action.tableAddr;
      const lastHandId = makeLatestHandSelector()(wholeState, { params: { tableAddr } });
      const fakeProps = { params: { tableAddr, handId: lastHandId } };
      const lastHand = makeHandSelector()(wholeState, fakeProps);
      const sb = makeSbSelector()(wholeState, fakeProps);
      const bb = sb * 2;
      const dealer = lastHand.get('dealer');
      const state = lastHand.get('state');
      const newReceipt = (function getNewReceipt() {
        switch (action.type) {
          case BET:
            return table.betReceipt(action.handId, action.amount);
          case FOLD:
            return table.foldReceipt(action.handId, action.amount);
          case CHECK: {
            switch (action.checkType) {
              case 'preflop':
                return table.checkPreflopReceipt(action.handId, action.amount);
              case 'flop':
                return table.checkFlopReceipt(action.handId, action.amount);
              case 'river':
                return table.checkRiverReceipt(action.handId, action.amount);
              case 'turn':
                return table.checkTurnReceipt(action.handId, action.amount);
              default:
                throw new Error('Invalid check type in payFlow. check type: ', action.checkType);
            }
          }
          default:
            throw new Error('Invalid action type in payFlow. type: ', action.type);
        }
      }());

      const lineup = makeLineupSelector()(wholeState, fakeProps).toJS();
      lineup[action.pos].last = newReceipt;

      const isBettingDone = pokerHelper.isBettingDone(lineup, dealer, state, bb);

      // Note: the only case we want to prevent faking receipt in advance is that
      // after preflop there could be chances that the last player in preflop hand
      // becomes the first player in this flop hand
      if (!(isBettingDone && state === 'preflop')) {
        yield put(receiptSet(action.tableAddr, action.handId, action.pos, newReceipt));
      }

      const holeCards = yield table.pay(newReceipt);
      yield put({ type: pay.SUCCESS, payload: holeCards.cards });
    } catch (err) {
      // unset toggle flag
      yield put(receiptSet(action.tableAddr, action.handId, action.pos, action.prevReceipt));
      Raven.captureException(err, { tags: {
        tableAddr: action.tableAddr,
        handId: action.handId,
      } });
      yield put({ type: pay.FAILURE, payload: err });
    }
  }
}

function* sendMessage(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    yield table.sendMessage(action.message);
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
    } });
  }
}

function* performBet(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    const holeCards = yield table.bet(action.handId, action.amount);
    yield put(setCards(action.tableAddr, action.handId, holeCards.cards));
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}

function* sitoutFlow() {
  while (true) { //eslint-disable-line
    const req = yield take(sitOutToggle.REQUEST);
    const action = req.payload;

    // Note: fake sitout first, if the request fails, roll back to the old one.
    const pre = preToggleSitout({
      tableAddr: action.tableAddr,
      handId: action.handId,
      pos: action.pos,
      sitout: action.nextSitoutState,
    });
    yield put(pre);

    try {
      const table = new TableService(action.tableAddr, action.privKey);
      const receipt = yield table.sitOut(action.handId, action.amount);
      yield put({ type: sitOutToggle.SUCCESS, payload: receipt });
    } catch (err) {
      Raven.captureException(err, {
        tags: {
          tableAddr: action.tableAddr,
          handId: action.handId,
        },
      });

      yield put({
        type: sitOutToggle.FAILURE,
        payload: err,
        tableAddr: action.tableAddr,
        handId: action.handId,
        pos: action.pos,
        sitout: action.originalSitout,
      });
    }
  }
}

function* performShow(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    yield table.show(action.handId, action.amount, action.holeCards);
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}

export function* updateScanner() {
  const privKeySelector = makeSelectPrivKey();
  const myAddrSelector = makeSignerAddrSelector();
  const sbSelector = makeSbSelector();
  const myCardsSelector = makeMyCardsSelector();
  const winnnersSelector = makeSelectWinners();
  // toggle variables to avoid duplicate requests
  const payedBlind = {};
  const showed = {};
  const netted = {};

  while (true) { //eslint-disable-line
    const action = yield take(UPDATE_RECEIVED);
    // fetch state if not existing
    const state = yield select();
    const myAddr = myAddrSelector(state);
    const privKey = privKeySelector(state);
    const sb = sbSelector(state, { params: { tableAddr: action.tableAddr } });
    const toggleKey = action.tableAddr + action.hand.handId;

    // do nothing if hand data missing
    if (!action.hand || !action.hand.lineup) {
      continue; // eslint-disable-line no-continue
    }

    let complete;

    try {
      complete = pokerHelper.isHandComplete(action.hand.lineup, action.hand.dealer, action.hand.state);
    } catch (e) {
      continue; // eslint-disable-line no-continue
    }

    // check if turn to pay small blind
    if (!complete) {
      if (isSbTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, sb, privKey));
        continue; // eslint-disable-line no-continue
      }
      // check if turn to pay big blind
      if (isBbTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, sb * 2, privKey));
        continue; // eslint-disable-line no-continue
      }

      // check if turn to pay 0 receipt
      if (is0rTurnByAction(action, { address: myAddr, sb }) && !payedBlind[toggleKey]) {
        payedBlind[toggleKey] = true;
        yield put(bet(action.tableAddr, action.hand.handId, 0, privKey));
        continue; // eslint-disable-line no-continue
      }

      // check if's showtime!
      const isShow = isShowTurnByAction(action, { address: myAddr, sb });
      if (isShow && !showed[toggleKey]) {
        showed[toggleKey] = true;
        const amount = lastAmountByAction(action, { address: myAddr });
        const holeCards = myCardsSelector(state, { params: { tableAddr: action.tableAddr, handId: action.hand.handId } });
        yield put(show(action.tableAddr, action.hand.handId, holeCards, amount, privKey));
        continue; // eslint-disable-line no-continue
      }
    }
    // check if netting exists that we need to sign
    if (hasNettingInAction(action, { address: myAddr })
      && !netted[toggleKey]) {
      netted[toggleKey] = true;
      const balances = action.hand.netting.newBalances;
      yield put(net(action.tableAddr, action.hand.handId, balances, privKey));
      continue; // eslint-disable-line no-continue
    }
    if (!storageService.getItem(`won[${toggleKey}]`)) {
      const winners = winnnersSelector(state, { params: { tableAddr: action.tableAddr, handId: action.hand.handId } });
      if (winners && winners.length) {
        storageService.setItem(`won[${toggleKey}]`, true);
        const winnerMessages = winners.map((winner) => {
          const handString = (winner.hand) ? `with ${winner.hand}` : '';
          return `player ${nickNameByAddress(winner.addr)} won ${formatNtz(winner.amount)} \u20a6 ${handString}`;
        });
        yield put(addMessage(winnerMessages.join(', '), action.tableAddr, null, Date.now()));
        continue; // eslint-disable-line no-continue
      }
    }
  }
}

export function* tableStateSaga() {
  yield takeEvery(SEND_MESSAGE, sendMessage);
  yield takeEvery(BET, performBet);
  yield takeEvery(SHOW, performShow);
  yield takeEvery(NET, submitSignedNetting);
  yield takeEvery(HAND_REQUEST, handRequest);
  yield fork(sitoutFlow);
  yield fork(updateScanner);
  yield fork(payFlow);
}
