import ethUtil from 'ethereumjs-util';
import { select, put, take, call } from 'redux-saga/effects';
import Raven from 'raven-js';

import { createBlocky } from '../../../services/blockies';
import { nickNameByAddress } from '../../../services/nicknames';
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
    if (initialLoad) {
      initialLoad = false;
      const results = yield [select(), take(WEB3_CONNECTED)];
      const privKey = results[0].get('account').get('privKey');
      if (privKey !== undefined && privKey.length > 32) {
        req = { newAuthState: { privKey, loggedIn: true } };
      } else {
        continue; // eslint-disable-line no-continue
      }
    } else {
      // or wait for user login success to happen
      req = yield take(SET_AUTH);
    }

    const { privKey, loggedIn } = req.newAuthState;
    if (loggedIn) {
      const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
      const signer = `0x${ethUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
      const proxyAddr = yield select(makeSelectProxyAddr());
      const web3 = getWeb3();
      const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
      Raven.setUserContext({ id: signer });

      const [isLocked, owner] = yield Promise.all([
        promisifyWeb3Call(proxy.isLocked.call)(),
        promisifyWeb3Call(proxy.getOwner.call)(),
      ]);

      const account = yield select(makeSelectAccountData());

      yield put(accountLoaded({
        owner,
        isLocked,
        signer,
        blocky: createBlocky(signer),
        nickName: nickNameByAddress(signer),
      }));

      const refs = yield call(getRefs, account.accountId);
      yield put(accountLoaded({ refs }));
    } else {
      clearExpiringStorage();
    }
  }
}
