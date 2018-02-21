import { takeEvery, fork } from 'redux-saga/effects';

import { INJECT_ACCOUNT_UPDATE, CONTRACT_TX_SEND } from '../../AccountProvider/actions';

import { NOTIFY_REMOVE } from '../actions';

import { removeNotification } from './utils';
import { injectedWeb3NotificationDismiss } from './accountNotificationsSagas';
import { tableNotifications } from './tableNotificationsSaga';
import { connectionNotifications } from './connectionNotificationsSaga';

export function* notificationsSaga() {
  yield takeEvery(INJECT_ACCOUNT_UPDATE, injectedWeb3NotificationDismiss);
  yield takeEvery(NOTIFY_REMOVE, removeNotification);
  yield takeEvery(CONTRACT_TX_SEND, tableNotifications);

  yield fork(connectionNotifications);
}

export default [
  notificationsSaga,
];
