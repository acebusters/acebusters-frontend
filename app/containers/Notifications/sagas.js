import { put, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuid from 'uuid/v4';

import {
  NOTIFY_CREATE,
  NOTIFY_REMOVE,
  notifyAdd,
  notifyDelete,
  notifyRemoving,
} from './actions';

import { SET_AUTH } from '../AccountProvider/actions';

import {
  TEMP,
  loggedInSuccess,
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

export function* notificationsSaga() {
  yield takeEvery(SET_AUTH, authNotification);
  yield takeEvery(NOTIFY_CREATE, selectNotification);
  yield takeEvery(NOTIFY_REMOVE, removeNotification);
}

export default [
  notificationsSaga,
];
