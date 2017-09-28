import { select, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getWeb3 } from '../../AccountProvider/utils';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

import { updateInjectedAccount } from '../actions';
import { makeSelectInjected } from '../selectors';

export function* injectedWeb3ListenerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    if (window.web3) {
      const prevInjected = yield select(makeSelectInjected());
      try {
        const [injected] = yield call(promisifyWeb3Call(getWeb3(true).eth.getAccounts));
        if (prevInjected !== injected) {
          yield put(updateInjectedAccount(injected));
        }
      } catch (e) {} // eslint-disable-line no-empty
    }

    yield call(delay, 2000);
  }
}
