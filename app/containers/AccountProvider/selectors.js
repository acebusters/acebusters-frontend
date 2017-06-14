import EthUtil from 'ethereumjs-util';
import { createSelector } from 'reselect';
import { READY_STATE } from './actions';
import { getMethodKey } from './web3Connect';

/**
 * Direct selector to the accountProvider state domain
 */
const selectAccount = (state) => state.get('account');
const selectWeb3Methods = (state) => state.getIn(['account', 'web3', 'methods']);

/**
 * Other specific selectors
 */

const makeBlockySelector = () => createSelector(
  selectAccount,
  (account) => account.get('blocky'),
);

const makeNickNameSelector = () => createSelector(
  selectAccount,
  (account) => {
    if (account.get('nickName') === null) {
      return 'Guest';
    }
    return account.get('nickName');
  },
);

const makeSelectAccountData = () => createSelector(
  selectAccount,
  (account) => account.toJS()
);

const makeSignerAddrSelector = () => createSelector(
  selectAccount,
  // (account) => account.get('signerAddr'),
  (account) => {
    if (account && account.get('privKey')) {
      const privKeyBuffer = new Buffer(account.get('privKey').replace('0x', ''), 'hex');
      return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
    }
    return null;
  }
);

const makeSelectIsWeb3Connected = () => createSelector(
  selectAccount,
  (account) => account.get('web3ReadyState') === READY_STATE.OPEN
);

const makeSelectWeb3ErrMsg = () => createSelector(
  selectAccount,
  (account) => account.get('web3ErrMsg')
);

const makeSelectEmail = () => createSelector(
  selectAccount,
  (account) => account.get('email')
);

// return if current user is loggedIn or not
const makeSelectLoggedIn = () => createSelector(
  selectAccount,
  (account) => account.get('loggedIn')
);

const makeSelectPrivKey = () => createSelector(
  selectAccount,
  (account) => account.get('privKey')
);

const makeSelectProxyAddr = () => createSelector(
  selectAccount,
  (account) => account.get('proxy')
);

const makeSelectETHBalance = () => createSelector(
  selectAccount,
  selectWeb3Methods,
  (account, methods) => {
    if (account.get('proxy')) {
      const methodKey = getMethodKey({
        groupName: 'eth',
        methodName: 'getBalance',
        args: [account.get('proxy')],
      });

      return methods && methods.getIn([methodKey, 'value']);
    }

    return undefined;
  }
);

/**
 * Default selector used by AccountProvider
 */
export default makeSelectAccountData;
export {
  selectAccount,
  makeBlockySelector,
  makeNickNameSelector,
  makeSignerAddrSelector,
  makeSelectAccountData,
  makeSelectPrivKey,
  makeSelectProxyAddr,
  makeSelectEmail,
  makeSelectLoggedIn,
  makeSelectIsWeb3Connected,
  makeSelectWeb3ErrMsg,
  makeSelectETHBalance,
};
