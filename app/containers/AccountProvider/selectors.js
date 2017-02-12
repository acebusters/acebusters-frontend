import EthUtil from 'ethereumjs-util';
import { createSelector } from 'reselect';

/**
 * Direct selector to the accountProvider state domain
 */
const selectAccount = (state) => state.get('account');

/**
 * Other specific selectors
 */
const makeSelectAccountData = () => createSelector(
  selectAccount,
  (account) => account.toJS()
);

const makeSelectAddress = () => createSelector(
  selectAccount,
  (account) => {
    const privKey = account.get('priv');
    if (privKey) {
      const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
      return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
    }
    return null;
  }
);

const makeSelectPrivKey = () => createSelector(
  selectAccount,
  (account) => account.get('priv')
);


/**
 * Default selector used by AccountProvider
 */
export default makeSelectAccountData;
export {
  selectAccount,
  makeSelectPrivKey,
  makeSelectAddress,
};
