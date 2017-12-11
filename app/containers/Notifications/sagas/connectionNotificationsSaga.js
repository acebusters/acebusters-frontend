import { delay } from 'redux-saga';
import { take, takeEvery, race } from 'redux-saga/effects';
import { createPersistNotification, removeNotification } from './utils';
import { noConnectionDanger } from '../constants';

import { WEB3_CONNECTED, WEB3_DISCONNECTED } from '../../AccountProvider/actions';

function* addConnectionNotification() {
  // prevent notification flickering on bad connection
  const { expired } = yield race({
    expired: delay(1000),
    connected: take(WEB3_CONNECTED),
  });

  if (expired) {
    yield* createPersistNotification(noConnectionDanger);
  }
}

function* removeConnectionNotification() {
  yield* removeNotification({ txId: noConnectionDanger.txId });
}

export function* connectionNotifications() {
  yield takeEvery(WEB3_DISCONNECTED, addConnectionNotification);
  yield takeEvery(WEB3_CONNECTED, removeConnectionNotification);
}
