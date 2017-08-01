import { take, put, race, fork } from 'redux-saga/effects';

import {
  WORKER_ERROR,
  WALLET_EXPORTED,
  WORKER_PROGRESS,
} from './constants';

import { register } from './actions';

import { setProgress } from '../App/actions';

function* progress() {
  while (true) { //eslint-disable-line
    const action = yield take(WORKER_PROGRESS);
    yield put(setProgress(action.payload.progress));
  }
}

// The root saga is what we actually send to Redux's middleware.
export function* generateSaga() {
  yield fork(progress);

  while (true) { // eslint-disable-line no-constant-condition
    // We either expect successful encryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      export: take(WALLET_EXPORTED),
    });

    // If worker exited with error...
    if (worker.error) {
      yield put({ type: register.FAILURE, payload: worker.error });
    } else {
      yield put({ type: register.SUCCESS, payload: worker.export });
    }
  }
}

export default [
  generateSaga,
];
