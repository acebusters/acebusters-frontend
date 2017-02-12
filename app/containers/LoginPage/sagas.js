import { browserHistory } from 'react-router';
import { take, put, fork, race } from 'redux-saga/effects';

import { WORKER_ERROR, WALLET_IMPORTED } from './constants';
import { SET_AUTH } from '../AccountProvider/constants';

/**
 * Login saga
 */
export function* loginFlow() {
  while (true) { // eslint-disable-line no-constant-condition
    // We expect successful decryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      import: take(WALLET_IMPORTED),
    });

    // If worker exited with error...
    if (worker.error) {
      // tell the form that something went wrong
      continue;  // eslint-disable-line no-continue
    }
    // If worker succeeded, ...
    const { privKey, nextPath } = worker.import.data;
    // ...we send Redux appropiate actions
    yield put({ type: SET_AUTH, newAuthState: { privKey, loggedIn: true } }); // User is logged in (authorized)
    browserHistory.push(nextPath); // Go to page that was requested
  }
}

// The root saga is what is sent to Redux's middleware.
export function* loginSaga() {
  yield fork(loginFlow);
}

export default [
  loginSaga,
];
