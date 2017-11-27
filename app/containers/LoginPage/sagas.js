import { take, put, race, fork } from 'redux-saga/effects';

import { WORKER_ERROR, WALLET_IMPORTED, WORKER_PROGRESS } from './constants';

import { login } from './actions';

import { setProgress } from '../App/actions';

function* progress() {
  while (true) { //eslint-disable-line
    const action = yield take(WORKER_PROGRESS);
    yield put(setProgress(action.payload.progress));
  }
}

// The root saga is what is sent to Redux's middleware.
export function* loginSaga() {
  yield fork(progress);

  while (true) { // eslint-disable-line no-constant-condition
    // We expect successful decryption or error from worker.
    const worker = yield race({
      error: take(WORKER_ERROR),
      import: take(WALLET_IMPORTED),
    });

    // Resolve pending form promise.
    if (worker.error) {
      yield put({ type: login.FAILURE, payload: worker.error });
    } else {
      yield put({ type: login.SUCCESS, payload: worker.import });
    }
  }
}

export default [
  loginSaga,
];
