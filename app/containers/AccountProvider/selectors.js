import EthUtil from 'ethereumjs-util';
import { createSelector } from 'reselect';
import { READY_STATE } from './actions';
import { getMethodKey } from './utils';
import { conf } from '../../app.config';

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
  (account) => account.get('nickName') || 'Guest',
);

const makeSelectAccountData = () => createSelector(
  selectAccount,
  (account) => account.toJS()
);

const makeSignerAddrSelector = () => createSelector(
  selectAccount,
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

const makeSelectInjected = () => createSelector(
  selectAccount,
  (account) => account.get('injected'),
);

const makeSelectOwner = () => createSelector(
  selectAccount,
  (account) => account.get('owner'),
);

const makeSelectIsLocked = () => createSelector(
  selectAccount,
  (account) => !!account.get('isLocked'),
);

const makeSelectHasWeb3 = () => createSelector(
  makeSelectIsLocked(),
  makeSelectInjected(),
  (isLocked, injected) => !!(isLocked || injected)
);

const makeSelectWrongInjected = () => createSelector(
  makeSelectInjected(),
  makeSelectOwner(),
  (injected, owner) => (injected || '').toLowerCase() !== (owner || '').toLowerCase(),
);

const makeSelectNetworkSupported = () => createSelector(
  selectAccount,
  (account) => account.get('isLocked') || account.get('onSupportedNetwork')
);

const makeSelectProxyAddr = () => createSelector(
  selectAccount,
  (account) => account.get('proxy')
);

const makeSelectWeb3MethodValue = (address, methodName, args = []) => createSelector(
  selectAccount,
  (account) => account.getIn([address, 'methods', getMethodKey({ methodName, args }), 'value']),
);

const makeSelectCanSendTx = () => createSelector(
  makeSelectIsLocked(),
  makeSelectHasWeb3(),
  makeSelectNetworkSupported(),
  makeSelectWrongInjected(),
  makeSelectIsWeb3Connected(),
  makeSelectWeb3MethodValue(conf().contrAddr, 'paused'),
  (isLocked, hasWeb3, networkSupported, wrongInjected, isConnected, paused) => {
    if (paused || !isConnected) {
      return false;
    }

    if (isLocked) {
      return true;
    }

    return hasWeb3 && networkSupported && !wrongInjected;
  },
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
  makeSelectInjected,
  makeSelectWrongInjected,
  makeSelectOwner,
  makeSelectCanSendTx,
  makeSelectIsLocked,
  makeSelectWeb3MethodValue,
};
