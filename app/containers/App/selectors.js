/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form/immutable';

const selectGlobal = (state) => state.get('global');

const formSelector = formValueSelector('login');
const selectWorkerProgress = (state) => formSelector(state, 'workerProgress');

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
  selectWorkerProgress,
  makeSelectTransferShow,
  makeModalStackSelector,
  makeSelectLocationState,
};
