/**
 * Created by helge on 25.01.17.
 */
import EthUtil from 'ethereumjs-util';
import { call, put, takeLatest, select, fork, take } from 'redux-saga/effects';
import {
  setCards,
  updateReceived,
  bet,
  show,
  BET,
  SHOW,
  START_POLLING,
  UPDATE_RECEIVED,
} from './actions';

import {
  makeSelectPrivKey,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';
import {
  isSbTurnByAction,
  isBbTurnByAction,
  is0rTurnByAction,
  isShowTurnByAction,
  makeSbSelector,
  makeMaxBetSelector,
} from './selectors';
import TableService, { fetchTableState } from '../../services/tableService';

export function* poll(action) {
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
    // check against actual balances here
    // sign balances here
    let payload = new Buffer(action.balances.replace('0x', ''), 'hex');
    const priv = new Buffer(action.privKey.replace('0x', ''), 'hex');
    const hash = EthUtil.sha3(payload);
    const sig = EthUtil.ecsign(hash, priv);
    payload = sig.r.toString('hex') + sig.s.toString('hex') + sig.v.toString(16);

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
    yield table.show(action.handId, action.amount);
  } catch (err) {
    // TODO: handle;
    console.dir(err);
  }
}

export function* updateScanner() {
  const privKeySelector = makeSelectPrivKey();
  const myAddrSelector = makeSignerAddrSelector();
  const sbSelector = makeSbSelector();

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
    if (isSbTurnByAction(action, { address: myAddr })) {
      console.log('sb');
      yield put(bet(action.tableAddr, action.hand.handId, sb, privKey));
      continue; // eslint-disable-line no-continue
    }
    // check if turn to pay big blind
    if (isBbTurnByAction(action, { address: myAddr })) {
      yield put(bet(action.tableAddr, action.hand.handId, sb * 2, privKey));
      continue; // eslint-disable-line no-continue
    }

    // check if turn to pay 0 receipt
    if (is0rTurnByAction(action, { address: myAddr })) {
      yield put(bet(action.tableAddr, action.hand.handId, 0, privKey));
      continue; // eslint-disable-line no-continue
    }

    // check if time to show
    if (isShowTurnByAction(action, { address: myAddr })) {
      const maxBetSelector = makeMaxBetSelector();
      const max = maxBetSelector(state);
      yield put(show(action.tableAddr, action.hand.handId, max, privKey));
      continue; // eslint-disable-line no-continue
    }
  }
}

function* tableSaga() {
  yield takeLatest(BET, performBet);
  yield takeLatest(SHOW, performShow);
  yield takeLatest(START_POLLING, poll);
  yield fork(updateScanner);
}

export default [
  tableSaga,
];
