import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

import { isSellStartEvent } from './utils';

function selectDashboard(state) {
  return state.get('dashboard');
}

export const createDashboardTxsSelector = () => createSelector(
  selectDashboard,
  (dashboard) => ({
    txError: dashboard.getIn(['failedTx', 'error']),
    failedTxAction: dashboard.hasIn(['failedTx', 'action']) ? dashboard.getIn(['failedTx', 'action']).toJS() : null,
    dashboardEvents: dashboard.get('events') && dashboard.get('events').toList().toJS(),
    pendingSell: (
      (dashboard.get('events') || fromJS({}))
        .toList().toJS()
        .filter((event) => event.pending && isSellStartEvent(event))
        .map((event) => event.transactionHash)
    ),
  }),
);

export const getActiveTab = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('activeTab'),
);
