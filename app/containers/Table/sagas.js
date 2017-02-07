/**
 * Created by helge on 25.01.17.
 */
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { call, put, takeLatest, select, take, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { pay } from './actions';
import * as Config from '../../app.config';

import { addressSelector, privKeySelector } from '../Account/selectors';
import { makeHandSelector } from '../Table/selectors';

const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

export function* getHand(action) {
  const header = new Headers({ 'Content-Type': 'application/json' });
  const myInit = { headers: header, method: 'GET' };
  const request = new Request(`${Config.apiBasePath}/table/${action.payload.tableAddr}/hand/${action.payload.handId}`, myInit);
  const lastHand = yield call(() => fetch(request).then((res) => res.json()));
  yield put({ type: 'COMPLETE_HAND_QUERY', hand: lastHand });
}

export function* dispatchDealingAction() {
  const state = yield select();

  const hand = makeHandSelector(state);
  const privKey = privKeySelector(state);
  const handId = hand.handId;
  let amount = 0;
  const myAddr = addressSelector(state);
  const dealer = hand.dealer;
  const myPos = pokerHelper.getMyPos(hand.lineup, myAddr);
  const sb = pokerHelper.nextActivePlayer(hand.lineup, dealer + 1);

  const whosTurn = pokerHelper.whosTurn(hand);
  if ((whosTurn === sb && myPos !== sb)
        || (hand.state !== 'dealing')
        || (state.TableReducer.error)
        || state.TableReducer.performedDealing) {
    return;
  }

  const bb = pokerHelper.nextActivePlayer(hand.lineup, sb + 1);
  if (myPos === sb) {
    amount = 50000;
  }
  if (myPos === bb) { amount = 100000; }
  const tableAddr = state.TableReducer.tableAddr;
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
  while (true) {                        // eslint-disable-line
    // watches the states and continues whenever new state is returned
    const action = yield take('*');     // eslint-disable-line
    const state = yield select();

    if (state.TableReducer.complete) {
      if (!wait) {
        wait = yield fork(waitThenNextHand);
      }
    }

    if (state.TableReducer.hand && state.TableReducer.hand.state === 'dealing') {
      yield call(dispatchDealingAction);
    }
  }
}

export function* waitThenNextHand() {
  // debounce by 500ms
  yield call(delay, 2000);
  yield put({ type: 'NEXT_HAND' });
  yield call(delay, 2000);
}

function* mySaga() {
  yield takeLatest('GET_HAND_REQUESTED', getHand);
  yield takeLatest('PERFORM_DEALING_ACTION', performDealingAction);
  yield watchAndGet();
}

export default mySaga;
