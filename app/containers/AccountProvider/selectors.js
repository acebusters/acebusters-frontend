import EthUtil from 'ethereumjs-util';
import { createSelector } from 'reselect';

import { ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';

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

const makeAddressSelector = () => createSelector(
  selectAccount,
  (account) => {
    const privKey = account.get('privKey');
    if (privKey) {
      const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
      return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
    }
    return null;
  }
);

const makeSelectContract = () => createSelector(
  selectAccount,
  () => {
    if (typeof window.web3 !== 'undefined') {
      const contract = window.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
      return contract;
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
  makeAddressSelector,
  makeSelectContract,
  makeSelectPrivKey,
};
