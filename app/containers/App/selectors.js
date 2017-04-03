/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectTransferShow = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('transferShow')
);

const makeModalStackSelector = () => createSelector(
  selectGlobal,
  (state) => (state && state.get('modalStack')) ? state.get('modalStack').toJS() : []
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  makeSelectTransferShow,
  makeModalStackSelector,
  makeSelectLocationState,
};
