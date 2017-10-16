import { select, put, take, call } from 'redux-saga/effects';
import Raven from 'raven-js';

import { ABI_PROXY } from '../../../app.config';
import { makeSelectProxyAddr, makeSelectAccountData } from '../selectors';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

import { getWeb3 } from '../utils';
import { SET_AUTH, WEB3_CONNECTED, accountLoaded } from '../actions';

import { clearExpiringStorage } from '../../../services/expiringLocalStorage';
import { getRefs } from '../../../services/account';

export function* accountLoginSaga() {
  let initialLoad = true;
  while (true) { // eslint-disable-line no-constant-condition
    let req;
    // load account data when page is loaded,
    // and user is already logged in from session storage
    const account = yield select(makeSelectAccountData());
    if (initialLoad) {
      initialLoad = false;
      yield take(WEB3_CONNECTED);
      if (account.privKey !== undefined && account.privKey.length > 32) {
        req = {
          newAuthState: {
            privKey: account.privKey,
            loggedIn: true,
          },
        };
      } else {
        continue; // eslint-disable-line no-continue
      }
    } else {
      // or wait for user login success to happen
      req = yield take(SET_AUTH);
    }

    const { loggedIn } = req.newAuthState;
    if (loggedIn) {
      const proxyAddr = yield select(makeSelectProxyAddr());
      const web3 = getWeb3();
      const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
      Raven.setUserContext({ id: account.signerAddr });

      const [isLocked, owner] = yield Promise.all([
        promisifyWeb3Call(proxy.isLocked.call)(),
        promisifyWeb3Call(proxy.getOwner.call)(),
      ]);

      yield put(accountLoaded({
        owner,
        isLocked,
      }));

      const refs = yield call(getRefs, account.accountId);
      yield put(accountLoaded({ refs }));
    } else {
      clearExpiringStorage();
    }
  }
}
