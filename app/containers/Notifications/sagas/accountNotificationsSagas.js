import { put, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { makeSelectInjected } from '../../AccountProvider/selectors';
import { getWeb3 } from '../../AccountProvider/utils';
import { notifyDelete } from '../actions';
import { loggedInSuccess, noWeb3Danger, noInjectedDanger, firstLogin, notLoggedIn } from '../constants';

import { createTempNotification, createPersistNotification, removeNotification } from './utils';

export function* authNotification({ newAuthState }) {
  const { loggedIn } = newAuthState;
  if (loggedIn) {
    yield* removeNotification({ txId: notLoggedIn.txId });
    yield* removeNotification({ txId: firstLogin.txId });
    yield* createTempNotification(loggedInSuccess);
  }
}

export function* injectedWeb3Notification({ payload: { isLocked } }) {
  if (!isLocked) {
    yield call(delay, 2000);
    const web3 = getWeb3(true);
    const injected = yield select(makeSelectInjected());
    if (!web3) {
      yield* createPersistNotification(noWeb3Danger);
    } else if (!injected) {
      yield* createPersistNotification(noInjectedDanger);
    }
  }
}

export function* injectedWeb3NotificationDismiss({ payload: injected }) {
  if (typeof injected === 'string') {
    yield put(notifyDelete(noWeb3Danger.txId));
  }
}

export function* visitorModeNotification({ payload: { pathname = '' } }) {
  const state = yield select();
  const loggedIn = yield call([state, state.getIn], ['account', 'loggedIn']);
  if (!loggedIn) {
    const isNotificationVisible = !pathname.match(/register|login/);
    if (isNotificationVisible) {
      yield* createPersistNotification(notLoggedIn);
    } else {
      yield* removeNotification({ txId: notLoggedIn.txId });
    }
  }
}
