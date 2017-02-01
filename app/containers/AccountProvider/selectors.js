import { createSelector } from 'reselect';

/**
 * Direct selector to the accountProvider state domain
 */
const selectAccount = (state) => state.get('account');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AccountProvider
 */

const makeSelectAccountData = () => createSelector(
  selectAccount,
  (accountState) => accountState.toJS()
);

export default makeSelectAccountData;
export {
  selectAccount,
};
