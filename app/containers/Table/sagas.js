/**
 * Created by helge on 25.01.17.
 */
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { call, put, takeLatest, select, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { updateReceived, completeBet, completeFold, completeShow } from './actions';
import { ABI_BET, ABI_FOLD, ABI_LEAVE, checkABIs, apiBasePath } from '../../app.config';
import {
  fetchTableState,
  pay,
  show,
  leave,
  netting,
} from '../../services/table';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

export function* getHand(action) {
  const header = new Headers({ 'Content-Type': 'application/json' });
  const myInit = { headers: header, method: 'GET' };
  const request = new Request(`${apiBasePath}/table/${action.payload.tableAddr}/hand/${action.payload.handId}`, myInit);
  const lastHand = yield call(() => fetch(request).then((res) => res.json()));
  yield put({ type: 'COMPLETE_HAND_QUERY', hand: lastHand });
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
  yield put({ type: 'PERFORM_DEALING_ACTION', handId, amount, privKey, tableAddr });
}

function* performDealingAction(action) {
  const handId = action.handId;
  const amount = action.amount;
  const privKey = action.privKey;
  const tableAddr = action.tableAddr;
  try {
    const holeCards = yield call(() => pay(handId, amount, privKey, tableAddr, ABI_BET, 'bet').then((res) => res.json()));
    yield put({ type: 'COMPLETE_BET', handId, amount, holeCards, privKey });
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* waitThenNextHand() {
  // debounce by 500ms
  yield call(delay, 2000);
  yield put({ type: 'NEXT_HAND' });
  yield call(delay, 2000);
}

export function* poll(action) {
  try {
    const tableState = yield call(fetchTableState, action.tableAddr);
    yield put(updateReceived(tableState, action.sb));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* submitBet(action) {
  try {
    const cards = yield call(pay, action.handId, action.amount, action.privKey, action.tableAddr, ABI_BET, 'bet');
    yield put(completeBet(cards, action.privKey));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* submitFold(action) {
  try {
    const cards = yield call(pay, action.handId, action.amount, action.privKey, action.tableAddr, ABI_FOLD, 'fold');
    yield put(completeFold(cards, action.privKey));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* submitShow(action) {
  try {
    const distribution = yield call(show, action.handId, action.myMaxBet, action.cards, action.privKey, action.tableAddr);
    yield put(completeShow(distribution));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* submitCheck(action) {
  const abi = checkABIs[action.state];
  try {
    const cards = yield call(pay, action.handId, action.myMaxBet, action.privKey, action.tableAddr, abi, abi[0].name);
    yield put(completeBet(cards, action.privKey));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
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
    yield put(netting(payload, action.tableAddr, action.handId));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* submitLeave(action) {
  try {
    const cards = yield call(leave, action.handId, action.amount, action.privKey, action.tableAddr, ABI_LEAVE, 'leave');
    yield put(completeBet(cards, action.privKey));
  } catch (err) {
    yield put({ type: 'FAILED_REQUEST', err });
  }
}

export function* updateHandler() {
  const state = yield select();
  if (state.get('table').get('complete')) {
    yield fork(waitThenNextHand);
  }

  if (state.get('table').get('hand') && state.get('table').get('hand').state === 'dealing') {
    yield call(dispatchDealingAction);
  }
}

function* tableSaga() {
  yield takeLatest('GET_HAND_REQUESTED', getHand);
  yield takeLatest('PERFORM_DEALING_ACTION', performDealingAction);
  yield takeLatest('START_POLLING', poll);
  yield takeLatest('SUBMIT_BET', submitBet);
  yield takeLatest('SUBMIT_FOLD', submitFold);
  yield takeLatest('SUBMIT_CHECK', submitCheck);
  yield takeLatest('SUBMIT_SHOW', submitShow);
  yield takeLatest('PROCESS_NETTING', submitSignedNetting);
  yield takeLatest('LEAVE_REQUEST', submitLeave);
  yield takeLatest('UPDATE_RECEIVED', updateHandler);
}

export default [
  tableSaga,
];
