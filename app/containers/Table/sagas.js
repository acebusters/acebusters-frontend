/**
 * Created by helge on 25.01.17.
 */
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { call, put, takeLatest, select, take, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { updateReceived, lineupReceived } from './actions';
import { ABI_BET, apiBasePath } from '../../app.config';
import { fetchTableState, pay, fetchLineup } from '../../services/table';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

function selectAddress(privKey) {
  if (privKey) {
    const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
    return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
  }
  return null;
}


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
  const privKey = state.get('account').get('privKey');
  const handId = hand.get('handId');
  let amount = 0;
  const myAddr = selectAddress(privKey);
  const dealer = hand.get('dealer');
  const myPos = pokerHelper.getMyPos(hand.get('lineup').toJS(), myAddr);
  const sb = pokerHelper.nextActivePlayer(hand.get('lineup').toJS(), dealer + 1);

  const whosTurn = pokerHelper.whosTurn(hand.toJS());
  if ((whosTurn === sb && myPos !== sb)
        || (hand.get('state') !== 'dealing')
        || (state.get('table').get('error'))
        || state.get('table').get('performedDealing')) {
    return;
  }

  const bb = pokerHelper.nextActivePlayer(hand.get('lineup').toJS(), sb + 1);
  if (myPos === sb) { amount = 50000; }
  if (myPos === bb) { amount = 100000; }
  const tableAddr = state.get('tableAddr');
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
  } catch (error) {
    yield put({ type: 'FAILED_REQUEST', error });
  }
}

export function* watchAndGet() {
  let wait;
  while (true) {                                                         // eslint-disable-line
    // watches the states and continues whenever new state is returned
    const action = yield take('*');                                      // eslint-disable-line
    const state = yield select();

    if (state.get('table').get('complete')) {
      if (!wait) {
        wait = yield fork(waitThenNextHand);
      }
    }

    if (state.get('table').get('hand') && state.get('table').get('hand').get('state') === 'dealing') {
      yield call(dispatchDealingAction);
    }
  }
}

export function* poll(action) {
  try {
    const tableState = yield call(fetchTableState, action.tableAddr);
    yield put(updateReceived(tableState));
  } catch (err) {
    // missing action
  }
}

export function* getLineup(action) {
  try {
    const lineup = yield call(fetchLineup, action.tableAddr, action.privKey);
    yield put(lineupReceived(lineup));
  } catch (err) {
    // missing action
  }
}

export function* waitThenNextHand() {
  // debounce by 500ms
  yield call(delay, 2000);
  yield put({ type: 'NEXT_HAND' });
  yield call(delay, 2000);
}

function* tableSaga() {
  yield takeLatest('GET_HAND_REQUESTED', getHand);
  yield takeLatest('PERFORM_DEALING_ACTION', performDealingAction);
  yield takeLatest('START_POLLING', poll);
  yield takeLatest('GET_LINEUP', getLineup);
  yield watchAndGet();
}

export default [
  tableSaga,
];
