import { browserHistory } from 'react-router';
import { take, takeEvery, call, put, fork, race } from 'redux-saga/effects';
import crypto from 'crypto';

import account from '../../services/account';
import * as LocalStorage from '../../services/localStorage';

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
  WALLET_EXPORTED,
  WALLET_IMPORTED,
  EMAIL_CONF_SUCCESS,
} from './constants';

/**
 * Effect to handle authorization
 * @param  {string} email               The email of the user
 * @param  {string} wallet              The serialized wallet of the user
 */
export function* storeAccount({ email, wallet, recapResponse }) {
  // We send an action that tells Redux we're sending a request
  yield put({ type: SENDING_REQUEST, sending: true });

  // We then try to register the user
  try {
    return yield call(account.register, email, wallet, recapResponse);
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
    return yield call(account.login, email);
  } catch (error) {
    // If we get an error we send Redux the appropiate action and return
    yield put({ type: REQUEST_ERROR, error: error.message });

    return false;
  }
}

/**
 * Log in saga
 */
export function* loginFlow() {
  // Because sagas are generators, doing `while (true)` doesn't block our program
  // Basically here we say "this saga is always listening for actions"
  while (true) { // eslint-disable-line no-constant-condition
    // We want the worker to load while the user is typing his credentials.
    // If worker is not loaded until user done, something is funky.
    const winner = yield race({
      load: take(WORKER_LOADED),
      request: take(LOGIN_REQUEST),
    });
    if (winner.request) { // If worker not loaded on time...
      const errorMessage = 'webworker not available.';
      yield put({ type: REQUEST_ERROR, error: errorMessage });
      continue;  // eslint-disable-line no-continue
    }
    const { email, password } = yield take(LOGIN_REQUEST);
    const accResp = yield call(login, { email });
    if (!accResp || !accResp.wallet) {
      const errorMessage = 'email does not exist.';
      yield put({ type: REQUEST_ERROR, error: errorMessage });
      continue;  // eslint-disable-line no-continue
    }
    const wallet = JSON.parse(accResp.wallet);
    window.frame.contentWindow.postMessage({
      action: 'import',
      json: JSON.stringify(wallet),
      password,
    }, '*');
    // We now either expect successful encryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      import: take(WALLET_IMPORTED),
    });
    // When done, we tell Redux we're not in the middle of a request any more
    yield put({ type: SENDING_REQUEST, sending: false });
    // If worker exited with error...
    if (worker.error) {
      yield put({ type: REQUEST_ERROR, error: worker.error.event });
      continue;  // eslint-disable-line no-continue
    }
    // If worker succeeded, ...
    // ...we send Redux appropiate actions
    yield put({ type: SET_AUTH, newAuthState: true }); // User is logged in (authorized)
    yield put({ type: CHANGE_FORM, newFormState: { username: '', password: '' } }); // Clear form
    LocalStorage.setItem('privKey', worker.import.data.privKey);
    forwardTo(worker.import.data.nextPath); // Go to dashboard page
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
    LocalStorage.removeItem('privKey');
    forwardTo('/');
  }
}

function* goLogin() {
  forwardTo('/login');
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
    if (winner.request) { // If worker not loaded on time...
      const errorMessage = 'webworker not available.';
      yield put({ type: REQUEST_ERROR, error: errorMessage });
      continue;  // eslint-disable-line no-continue
    }
    // If worker is ready, let's wait for user...
    const request = yield take(EXPORT_REQUEST);
    const { email, password, recapResponse } = request.request;
    const seed = crypto.randomBytes(32);
    const hexSeed = seed.toString('hex');
    const msg = {
      action: 'export',
      hexSeed,
      password,
      randomBytes: crypto.randomBytes(64),
    };
    window.msg = msg;
    window.frame.contentWindow.postMessage(msg, '*');
    // We send an action that tells Redux we're sending a request
    yield put({ type: SENDING_REQUEST, sending: true });
    // We now either expect successful encryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      export: take(WALLET_EXPORTED),
    });
    // If worker exited with error...
    if (worker.error) {
      yield put({ type: REQUEST_ERROR, error: worker.error.event });
      continue;  // eslint-disable-line no-continue
    }
    // If worker succeeded, ...
    const wallet = worker.export.wallet;
    // We call the `storeAccount` task with the data, telling it that we are registering a user
    // This returns `true` if the registering was successful, `false` if not
    const wasSuccessful = yield call(storeAccount, { email, wallet, recapResponse });

    // If we could register a user, we send the appropiate actions
    if (wasSuccessful) {
      yield put({ type: CHANGE_FORM, newFormState: { username: '', password: '' } }); // Clear form
      forwardTo('/confirm'); // Go to confirm page
    }
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
  yield takeEvery(EMAIL_CONF_SUCCESS, goLogin);
}

// Little helper function to abstract going to different pages
function forwardTo(location) {
  browserHistory.push(location);
}

// Bootstrap sagas
export default [
  accountSaga,
];
