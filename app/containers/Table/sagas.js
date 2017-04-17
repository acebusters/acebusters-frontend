/**
 * Created by helge on 25.01.17.
 */
import ethUtil from 'ethereumjs-util';
import { call, put, takeEvery, select, fork, take } from 'redux-saga/effects';
import Raven from 'raven-js';
import { PokerHelper, ReceiptCache } from 'poker-helper';

import {
  setCards,
  updateReceived,
  bet,
  show,
  net,
  receiptSet,
  pay,
  sitOutToggle,
  BET,
  SHOW,
  NET,
  HAND_REQUEST,
  UPDATE_RECEIVED,
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
} from './selectors';

import TableService, { getHand } from '../../services/tableService';

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
      // set toggle flag
      const newReceipt = table.betReceipt(action.handId, action.amount);
      yield put(receiptSet(action.tableAddr, action.handId, action.pos, newReceipt));
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
      yield put({ type: sitOutToggle.FAILURE, payload: err });
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

    // check if turn to pay small blind
    if (!pokerHelper.isHandComplete(action.hand.lineup, action.hand.dealer, action.hand.state)) {
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
  }
}

export function* tableStateSaga() {
  yield takeEvery(BET, performBet);
  yield takeEvery(SHOW, performShow);
  yield takeEvery(NET, submitSignedNetting);
  yield takeEvery(HAND_REQUEST, handRequest);
  yield fork(sitoutFlow);
  yield fork(updateScanner);
  yield fork(payFlow);
}
