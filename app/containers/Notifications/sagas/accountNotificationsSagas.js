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

function selectNotification(state, txId) {
  return state.get('notifications').find((item) => item.get('txId') === txId);
}

export function* injectedWeb3Notification({ payload: { isLocked } }) {
  if (!isLocked) {
    yield call(delay, 2000);
    const web3 = getWeb3(true);
    if (!web3) {
      yield* createPersistNotification(noWeb3Danger);
    } else {
      while (true) { // eslint-disable-line no-constant-condition
        const injected = yield select(makeSelectInjected());
        const notification = yield select(selectNotification, noInjectedDanger.txId);

        if (!injected && !notification) {
          yield* createPersistNotification(noInjectedDanger);
        } else if (injected && notification) {
          yield* removeNotification(noInjectedDanger);
        }

        yield call(delay, 2000);
      }
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
