import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

import { isETHPayoutEvent } from './utils';

function selectDashboard(state) {
  return state.get('dashboard');
}

export const createDashboardTxsSelector = () => createSelector(
  selectDashboard,
  (dashboard) => ({
    txError: dashboard.getIn(['failedTx', 'error']),
    failedTxAction: dashboard.hasIn(['failedTx', 'action']) ? dashboard.getIn(['failedTx', 'action']).toJS() : null,
    dashboardEvents: dashboard.get('events') && dashboard.get('events').toList().toJS(),
    pendingETHPayout: (
      (dashboard.get('events') || fromJS({})).toList().toJS()
        .filter((event) => event.pending && isETHPayoutEvent(event)).length > 0
    ),
  }),
);

export const getActiveTab = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('activeTab'),
);

export const getAmountUnit = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('amountUnit'),
);

export const getInvestType = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('investType'),
);
