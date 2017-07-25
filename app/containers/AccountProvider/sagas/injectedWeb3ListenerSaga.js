import { select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { updateInjectedAccount } from '../actions';

export function* injectedWeb3ListenerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    yield call(delay, 1000);
    const state = yield select();
    const prevInjected = yield call([state, state.getIn], ['account', 'injected']);
    const injected = window.web3 && window.web3.eth.accounts[0];

    if (prevInjected !== injected) {
      yield put(updateInjectedAccount(injected));
    }
  }
}
