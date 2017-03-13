/**
 * Created by helge on 25.01.17.
 */
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { call, put, takeLatest, select, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  nextHand,
  setCards,
  updateReceived,
  completeHandQuery,
  HAND_REQUEST,
  PERFORM_DEALING_ACTION,
  START_POLLING,
  UPDATE_RECEIVED,
} from './actions';

import { apiBasePath } from '../../app.config';
import TableService, { fetchTableState } from '../../services/tableService';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

export function* getHand({ tableAddr, handId }) {
  const header = new Headers({
    'Content-Type': 'application/json',
  });
  const myInit = {
    headers: header,
    method: 'GET',
  };
  const request = new Request(`${apiBasePath}/table/${tableAddr}/hand/${handId}`, myInit);
  const lastHand = yield call(() => fetch(request).then((res) => res.json()));
  yield put(completeHandQuery(tableAddr, lastHand));
}

export function* dispatchDealingAction() {
  const state = yield select();
  const hand = state.get('table').get('hand');
  if (!hand.lineup) {
    return;
  }
  const myAddr = state.get('account').get('proxy');
  const handId = hand.handId;
  const dealer = hand.dealer;
  const myPos = pokerHelper.getMyPos(hand.lineup, myAddr);
  const sb = pokerHelper.nextActivePlayer(hand.lineup, dealer + 1);
  let amount = 0;
  const whosTurn = pokerHelper.whosTurn(hand);
  if ((whosTurn === sb && myPos !== sb)
        || (hand.state !== 'dealing')
        || (state.get('table').get('error'))
        || state.get('table').get('performedDealing')) {
    return;
  }

  const bb = pokerHelper.nextActivePlayer(hand.lineup, sb + 1);
  const sbAmount = state.get('table').get('smallBlind');
  if (myPos === sb) { amount = sbAmount; }
  if (myPos === bb) { amount = sbAmount * 2; }

  const tableAddr = state.get('table').get('tableAddr');
  const privKey = state.get('account').get('privKey');
  yield put({ type: PERFORM_DEALING_ACTION, handId, amount, privKey, tableAddr });
}

function* performDealingAction(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    const holeCards = yield table.bet(action.handId, action.amount);
    yield put(setCards(action.tableAddr, action.handId, holeCards));
  } catch (err) {
    // TODO: handle;
    console.dir(err);
  }
}

export function* waitThenNextHand(action) {
  // debounce by 500ms
  yield call(delay, 2000);
  yield put(nextHand(action.tableAddr, action.hand.handId + 1));
  yield call(delay, 2000);
}

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


export function* updateHandler(action) {
  if (action.hand && action.hand.lineup) {
    const handComplete = pokerHelper.checkForNextHand(action.hand);
    if (handComplete) {
      yield fork(waitThenNextHand(action.tableAddr, action.hand.handId + 1));
    }
  }

  if (action.hand.state === 'dealing') {
    // yield call(dispatchDealingAction);
  }
}


function* tableSaga() {
  yield takeLatest(HAND_REQUEST, getHand);
  yield takeLatest(PERFORM_DEALING_ACTION, performDealingAction);
  yield takeLatest(START_POLLING, poll);
  yield takeLatest(UPDATE_RECEIVED, updateHandler);
}

export default [
  tableSaga,
];
