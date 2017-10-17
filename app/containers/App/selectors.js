/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form/immutable';

export const selectGlobal = (state) => state.get('global');

const formSelector = formValueSelector('login');
export const selectWorkerProgress = (state) => formSelector(state, 'workerProgress');

export const makeSelectTransferShow = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('transferShow')
);

export const makeSelectProgress = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('progress')
);

export const makeModalSelector = () => createSelector(
  selectGlobal,
  (state) => (state && state.get('modalStack').size > 0) ? state.get('modalStack').last() : null
);

export const makeSelectLocationState = () => {
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
