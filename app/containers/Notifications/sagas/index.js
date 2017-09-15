import { LOCATION_CHANGE } from 'react-router-redux';
import { takeEvery, call } from 'redux-saga/effects';

import { SET_AUTH, ACCOUNT_LOADED, INJECT_ACCOUNT_UPDATE, CONTRACT_TX_SEND } from '../../AccountProvider/actions';

import { NOTIFY_CREATE, NOTIFY_REMOVE } from '../actions';

import { createNotification, removeNotification } from './utils';
import { visitorModeNotification, authNotification, injectedWeb3Notification, injectedWeb3NotificationDismiss } from './accountNotificationsSagas';
import { tableNotifications } from './tableNotificationsSaga';

export function* notificationsSaga() {
  yield takeEvery(LOCATION_CHANGE, visitorModeNotification);
  yield takeEvery(SET_AUTH, authNotification);
  yield takeEvery(ACCOUNT_LOADED, injectedWeb3Notification);
  yield takeEvery(INJECT_ACCOUNT_UPDATE, injectedWeb3NotificationDismiss);
  yield takeEvery(NOTIFY_CREATE, createNotification);
  yield takeEvery(NOTIFY_REMOVE, removeNotification);
  yield takeEvery(CONTRACT_TX_SEND, tableNotifications);

  yield call(visitorModeNotification, {
    payload: {
      pathname: window.location.pathname,
    },
  });
}

export default [
  notificationsSaga,
];
