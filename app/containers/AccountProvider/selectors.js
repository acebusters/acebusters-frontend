import EthUtil from 'ethereumjs-util';
import { createSelector } from 'reselect';
import { READY_STATE } from './actions';

/**
 * Direct selector to the accountProvider state domain
 */
const selectAccount = (state) => state.get('account');

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

const makeSelectHasWeb3 = () => createSelector(
  selectAccount,
  (account) => !!(account.get('isLocked') || account.get('injected'))
);

const makeSelectNetworkSupported = () => createSelector(
  selectAccount,
  (account) => account.get('isLocked') || account.get('onSupportedNetwork')
);

const makeSelectProxyAddr = () => createSelector(
  selectAccount,
  (account) => account.get('proxy')
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
  makeSelectHasWeb3,
  makeSelectNetworkSupported,
};
