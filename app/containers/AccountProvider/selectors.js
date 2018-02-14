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
const selectAccountKey = (key) => createSelector(
  selectAccount,
  (account) => account.get(key)
);

const makeSelectLoggedIn = () => selectAccountKey('loggedIn');
const makeSelectPrivKey = () => selectAccountKey('privKey');
const makeSelectInjected = () => selectAccountKey('injected');
const makeSelectGenerated = () => selectAccountKey('generated');
const makeSelectWallet = () => selectAccountKey('wallet');
const makeSelectOwner = () => selectAccountKey('owner');
const makeSelectIsLocked = () => selectAccountKey('isLocked');

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

const makeSelectWeb3MethodValue = (address, methodName, args = []) => createSelector(
  selectAccount,
  (account) => account.getIn([address, 'methods', getMethodKey({ methodName, args }), 'value']),
);

const makeSelectCanSendTx = () => createSelector(
  makeSelectIsWeb3Connected(),
  makeSelectWeb3MethodValue(conf().contrAddr, 'paused'),
  (isConnected, paused) => isConnected && !paused,
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
  makeSelectEmail,
  makeSelectGenerated,
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
  makeSelectWallet,
};
