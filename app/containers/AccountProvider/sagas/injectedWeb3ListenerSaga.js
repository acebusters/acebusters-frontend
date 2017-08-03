import { select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { promisifyContractCall } from '../../../utils/promisifyContractCall';
import { updateInjectedAccount } from '../actions';

export function* injectedWeb3ListenerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    if (window.web3) {
      const state = yield select();
      const prevInjected = yield call([state, state.getIn], ['account', 'injected']);
      const getInjectedAccounts = yield call(promisifyContractCall, window.web3.eth.getAccounts);
      try {
        const [injected] = yield call(getInjectedAccounts);
        if (prevInjected !== injected) {
          yield put(updateInjectedAccount(injected));
        }
      } catch (e) {} // eslint-disable-line no-empty
    }

    yield call(delay, 2000);
  }
}
