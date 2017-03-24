/**
 * Created by helge on 25.01.17.
 */
import ethUtil from 'ethereumjs-util';
import { call, put, takeLatest, select, fork, take } from 'redux-saga/effects';
import {
  setCards,
  updateReceived,
  bet,
  show,
  net,
  BET,
  SHOW,
  NET,
  GET_INFO,
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
import TableService, { fetchTableState } from '../../services/tableService';

export function* getInfo(action) {
  try {
    const tableState = yield call(fetchTableState, action.tableAddr);
    yield put(updateReceived(action.tableAddr, tableState));
  } catch (err) {
    // TODO: handle;
    console.dir(err);
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
    // TODO: handle;
    console.dir(err);
  }
}

function* performBet(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    const holeCards = yield table.bet(action.handId, action.amount);
    yield put(setCards(action.tableAddr, action.handId, holeCards.cards));
  } catch (err) {
    // TODO: handle;
    console.dir(err);
  }
}

function* performShow(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    yield table.show(action.handId, action.amount, action.holeCards);
  } catch (err) {
    // TODO: handle;
    console.dir(err);
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

  while (true) {
    const action = yield take(UPDATE_RECEIVED);
    // do nothing if hand data missing
    if (!action.hand && !action.hand.lineup) {
      continue; // eslint-disable-line no-continue
    }
    // fetch state if not existing
    const state = yield select();
    const myAddr = myAddrSelector(state);
    const privKey = privKeySelector(state);
    const sb = sbSelector(state, { params: { tableAddr: action.tableAddr } });

    // check if turn to pay small blind
    if (isSbTurnByAction(action, { address: myAddr })
      && !payedBlind[action.tableAddr + action.hand.handId]) {
      payedBlind[action.tableAddr + action.hand.handId] = true;
      yield put(bet(action.tableAddr, action.hand.handId, sb, privKey));
      continue; // eslint-disable-line no-continue
    }
    // check if turn to pay big blind
    if (isBbTurnByAction(action, { address: myAddr })
      && !payedBlind[action.tableAddr + action.hand.handId]) {
      payedBlind[action.tableAddr + action.hand.handId] = true;
      yield put(bet(action.tableAddr, action.hand.handId, sb * 2, privKey));
      continue; // eslint-disable-line no-continue
    }

    // check if turn to pay 0 receipt
    if (is0rTurnByAction(action, { address: myAddr })
      && !payedBlind[action.tableAddr + action.hand.handId]) {
      payedBlind[action.tableAddr + action.hand.handId] = true;
      yield put(bet(action.tableAddr, action.hand.handId, 0, privKey));
      continue; // eslint-disable-line no-continue
    }

    // check if's showtime!
    const isShow = isShowTurnByAction(action, { address: myAddr });
    if (isShow && !showed[action.tableAddr + action.hand.handId]) {
      showed[action.tableAddr + action.hand.handId] = true;
      const amount = lastAmountByAction(action, { address: myAddr });
      const holeCards = myCardsSelector(state, { params: { tableAddr: action.tableAddr, handId: action.hand.handId } });
      yield put(show(action.tableAddr, action.hand.handId, holeCards, amount, privKey));
      continue; // eslint-disable-line no-continue
    }

    // check if netting exists that we need to sign
    if (hasNettingInAction(action, { address: myAddr })
      && !netted[action.tableAddr + action.hand.handId]) {
      netted[action.tableAddr + action.hand.handId] = true;
      const balances = action.hand.netting.newBalances;
      yield put(net(action.tableAddr, action.hand.handId, balances, privKey));
      continue; // eslint-disable-line no-continue
    }
  }
}

function* tableSaga() {
  yield takeLatest(BET, performBet);
  yield takeLatest(SHOW, performShow);
  yield takeLatest(NET, submitSignedNetting);
  yield takeLatest(GET_INFO, getInfo);
  yield fork(updateScanner);
}

export default [
  tableSaga,
];
