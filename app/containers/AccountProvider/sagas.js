import { browserHistory } from 'react-router';
import { take, call, put, fork, race } from 'redux-saga/effects';
import crypto from 'crypto';

import auth from '../../utils/auth';

import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  SET_AUTH,
  LOGOUT,
  CHANGE_FORM,
  REQUEST_ERROR,
  EXPORT_REQUEST,
  WORKER_ERROR,
  WORKER_LOADED,
  WORKER_EXPORTED,
} from './constants';

/**
 * Effect to handle authorization
 * @param  {string} email               The email of the user
 * @param  {string} wallet              The serialized wallet of the user
 */
export function* authorize({ email, wallet }) {
  // We send an action that tells Redux we're sending a request
  yield put({ type: SENDING_REQUEST, sending: true });

  // We then try to register the user
  try {
    return yield call(auth.register, email, wallet);
  } catch (error) {
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: REQUEST_ERROR, error: error.message });

    return false;
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: SENDING_REQUEST, sending: false });
  }
}

/**
 * Effect to login
 * @param  {string} email               The email of the user
 */
export function* login({ email }) {
  // We send an action that tells Redux we're sending a request
  yield put({ type: SENDING_REQUEST, sending: true });

  // We log in the user
  try {
    return yield call(auth.login, email);
  } catch (error) {
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: REQUEST_ERROR, error: error.message });

    return false;
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: SENDING_REQUEST, sending: false });
  }
}

/**
 * Effect to handle logging out
 */
export function* logout() {
  // We tell Redux we're in the middle of a request
  yield put({ type: SENDING_REQUEST, sending: true });

  // Similar to above, we try to log out by calling the `logout` function in the
  // `auth` module. If we get an error, we send an appropiate action. If we don't,
  // we return the response.
  try {
    const response = yield call(auth.logout);
    yield put({ type: SENDING_REQUEST, sending: false });

    return response;
  } catch (error) {
    yield put({ type: REQUEST_ERROR, error: error.message });
    return error;
  }
}

/**
 * Log in saga
 */
export function* loginFlow() {
  // Because sagas are generators, doing `while (true)` doesn't block our program
  // Basically here we say "this saga is always listening for actions"
  while (true) { // eslint-disable-line no-constant-condition
    // And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
    const request = yield take(LOGIN_REQUEST);
    const { username, password } = request.data;

    // A `LOGOUT` action may happen while the `authorize` effect is going on, which may
    // lead to a race condition. This is unlikely, but just in case, we call `race` which
    // returns the "winner", i.e. the one that finished first
    const winner = yield race({
      auth: call(authorize, { username, password, isRegistering: false }),
      logout: take(LOGOUT),
    });

    // If `authorize` was the winner...
    if (winner.auth) {
      // ...we send Redux appropiate actions
      yield put({ type: SET_AUTH, newAuthState: true }); // User is logged in (authorized)
      yield put({ type: CHANGE_FORM, newFormState: { username: '', password: '' } }); // Clear form
      forwardTo('/features'); // Go to dashboard page
      // If `logout` won...
    } else if (winner.logout) {
      // ...we send Redux appropiate action
      yield put({ type: SET_AUTH, newAuthState: false }); // User is not logged in (not authorized)
      yield call(logout); // Call `logout` effect
      forwardTo('/'); // Go to root page
    }
  }
}

/**
 * Log out saga
 * This is basically the same as the `if (winner.logout)` of above, just written
 * as a saga that is always listening to `LOGOUT` actions
 */
export function* logoutFlow() {
  while (true) { // eslint-disable-line no-constant-condition
    yield take(LOGOUT);
    yield put({ type: SET_AUTH, newAuthState: false });

    yield call(logout);
    forwardTo('/');
  }
}

/**
 * Register saga
 */
export function* registerFlow() {
  while (true) { // eslint-disable-line no-constant-condition
    // We want the worker to load while the user is typing his credentials.
    // If worker is not loaded until user done, something is funky.
    const winner = yield race({
      load: take(WORKER_LOADED),
      request: take(EXPORT_REQUEST),
    });
    let email;
    if (winner.request) { // If worker not loaded on time...
      const errorMessage = 'webworker not available.';
      yield put({ type: REQUEST_ERROR, error: errorMessage });
    } else if (winner.load) { // If worker is ready, let's wait for user...
      const request = yield take(EXPORT_REQUEST);
      email = request.email;
      const seed = crypto.getRandomValues(new Uint8Array(64));
      const hexSeed = seed.toString('hex');
      window.frame.contentWindow.postMessage({
        action: 'export',
        hexSeed,
        password: request.password,
        randomBytes: crypto.randomBytes(64),
      }, '*');
    }
    // We now either expect successful encryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      export: take(WORKER_EXPORTED),
    });
    // If worker exited with error...
    if (worker.error) {
      yield put({ type: REQUEST_ERROR, error: worker.error.event });
    // If worker succeeded, ...
    } else if (worker.export) {
      const wallet = yield take(WORKER_EXPORTED);
      // We call the `authorize` task with the data, telling it that we are registering a user
      // This returns `true` if the registering was successful, `false` if not
      const wasSuccessful = yield call(authorize, { email, wallet });

      // If we could register a user, we send the appropiate actions
      if (wasSuccessful) {
        yield put({ type: SET_AUTH, newAuthState: true }); // User is logged in (authorized) after being registered
        yield put({ type: CHANGE_FORM, newFormState: { username: '', password: '' } }); // Clear form
        forwardTo('/features'); // Go to dashboard page
      }
    }
  }
}

export function* exportFlow() {
  while (true) { // eslint-disable-line no-constant-condition

  }
}

// The root saga is what we actually send to Redux's middleware. In here we fork
// each saga so that they are all "active" and listening.
// Sagas are fired once at the start of an app and can be thought of as processes running
// in the background, watching actions dispatched to the store.
export function* accountSaga() {
  yield fork(loginFlow);
  yield fork(logoutFlow);
  yield fork(registerFlow);
}

// Little helper function to abstract going to different pages
function forwardTo(location) {
  browserHistory.push(location);
}

// Bootstrap sagas
export default [
  accountSaga,
];
