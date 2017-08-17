import { select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { updateInjectedAccount } from '../actions';

export function* injectedWeb3ListenerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    if (window.web3) {
      const state = yield select();
      const prevInjected = yield call([state, state.getIn], ['account', 'injected']);
      try {
        const [injected] = window.web3.eth.accounts;
        if (prevInjected !== injected) {
          yield put(updateInjectedAccount(injected));
        }
      } catch (e) { } // eslint-disable-line no-empty
    }

    yield call(delay, 2000);
  }
}
