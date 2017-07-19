import { put, takeEvery, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuid from 'uuid/v4';

import {
  NOTIFY_CREATE,
  NOTIFY_REMOVE,
  notifyAdd,
  notifyDelete,
  notifyRemoving,
} from './actions';

import { SET_AUTH, ACCOUNT_LOADED, INJECT_ACCOUNT_UPDATE } from '../AccountProvider/actions';

import {
  TEMP,
  loggedInSuccess,
  noWeb3Danger,
  temp,
  persist,
} from './constants';

function* createTempNotification(note) {
  yield put(notifyAdd(note));
  // TODO don't call removeNotification if NOTIFY_REMOVE is already dispatched
  // wait for NOTIFY_REMOVE to be dispatched by the user
  // or call NOTIFY_REMOVE after timeout
  yield delay(3000);
  yield* removeNotification({ txId: note.txId });
}

function* createPersistNotification(note) {
  yield put(notifyAdd(note));
}

function* selectNotification(action) {
  if (action.notifyType === TEMP) {
    temp.txId = uuid();
    yield* createTempNotification(temp);
  } else {
    persist.txId = uuid();
    // if persist
    yield* createPersistNotification(persist);
  }
}

function* removeNotification({ txId }) {
  // trigger remove note animation
  yield put(notifyRemoving(txId));
  // remove element after animation finishes
  yield delay(400);
  yield put(notifyDelete(txId));
}

function* authNotification({ newAuthState }) {
  const { loggedIn } = newAuthState;
  if (loggedIn) {
    yield* createTempNotification(loggedInSuccess);
  }
}

function* injectedWeb3Notification({ payload: { isLocked } }) {
  if (!isLocked) {
    const state = yield select();
    const injected = yield call([state, state.getIn], ['account', 'injected']);
    if (!injected) {
      yield* createPersistNotification(noWeb3Danger);
    }
  }
}

function* injectedWeb3NotificationDismiss({ payload: injected }) {
  if (typeof injected === 'string') {
    yield put(notifyDelete(noWeb3Danger.txId));
  }
}

export function* notificationsSaga() {
  yield takeEvery(SET_AUTH, authNotification);
  yield takeEvery(ACCOUNT_LOADED, injectedWeb3Notification);
  yield takeEvery(INJECT_ACCOUNT_UPDATE, injectedWeb3NotificationDismiss);
  yield takeEvery(NOTIFY_CREATE, selectNotification);
  yield takeEvery(NOTIFY_REMOVE, removeNotification);
}

export default [
  notificationsSaga,
];
