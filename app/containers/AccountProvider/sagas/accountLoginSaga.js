import React from 'react';
import ethUtil from 'ethereumjs-util';
import { select, put, fork, take } from 'redux-saga/effects';
import Raven from 'raven-js';

import { createBlocky } from '../../../services/blockies';
import { nickNameByAddress } from '../../../services/nicknames';
import { ABI_ACCOUNT_FACTORY, conf } from '../../../app.config';
import { indentity } from '../../../utils';
import { modalAdd } from '../../../containers/App/actions';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

import { getWeb3 } from '../utils';
import { SET_AUTH, WEB3_CONNECTED, accountLoaded } from '../actions';

import { ethEventListenerSaga } from './ethEventListenerSaga';

const getAccount = (web3, signer) => {
  const factoryContract = web3.eth.contract(ABI_ACCOUNT_FACTORY).at(conf().accountFactory);
  return (
    promisifyWeb3Call(factoryContract.getAccount.call)(signer)
      .then(
        indentity,
        () => Promise.reject('login error')
      )
  );
};

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
      Raven.setUserContext({ id: signer });
      // this reads account data from the account factory
      const [proxy, owner, isLocked] = yield getAccount(getWeb3(), signer);

      if (proxy === '0x') {
        yield put(modalAdd(
          <div>
            Seems proxy contract is not deployed yet
          </div>
        ));
      }

      // write data into the state
      yield put(accountLoaded({
        proxy,
        owner,
        isLocked,
        signer,
        blocky: createBlocky(signer),
        nickName: nickNameByAddress(signer),
      }));

      // start listen on the account factory for events
      // mostly auth errors
      const accFactoryContract = getWeb3().eth.contract(ABI_ACCOUNT_FACTORY).at(conf().accountFactory);
      yield fork(ethEventListenerSaga, accFactoryContract);
    }
  }
}
