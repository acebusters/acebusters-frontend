/**
 * Created by helge on 02.02.17.
 */

import { createSelector } from 'reselect';
import EthUtil from 'ethereumjs-util';

const accountStateSelector = (state) => (state) ? state.AccountReducer : null;

const privKeySelector = createSelector(
    accountStateSelector,
    (accountState) => accountState.privkey
);

const addressSelector = createSelector(
    accountStateSelector,
    (accountState) => {
      const privKey = accountState.privKey;
      if (privKey) {
        const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
        return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
      }
      return null;
    }
);

export {
    privKeySelector,
    addressSelector,
};
