import { take, put, race } from 'redux-saga/effects';

import { WORKER_ERROR, WALLET_IMPORTED } from './constants';
import { login } from './actions';

// The root saga is what is sent to Redux's middleware.
export function* loginSaga() {
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
