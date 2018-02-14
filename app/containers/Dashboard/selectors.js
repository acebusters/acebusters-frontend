import { createSelector } from 'reselect';

function selectDashboard(state) {
  return state.get('dashboard');
}

export const createDashboardTxsSelector = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('events') && dashboard.get('events').toList().toJS(),
);

export const createPendingsSelector = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('events') && dashboard.get('events').filter((item) => item.get('pending')).toMap(),
);

export const getActiveTab = () => createSelector(
  selectDashboard,
  (dashboard) => dashboard.get('activeTab'),
);
