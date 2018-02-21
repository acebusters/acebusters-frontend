import { put } from 'redux-saga/effects';

import { notifyDelete } from '../actions';
import { noWeb3Danger } from '../constants';

export function* injectedWeb3NotificationDismiss({ payload: injected }) {
  if (typeof injected === 'string') {
    yield put(notifyDelete(noWeb3Danger.txId));
  }
}
