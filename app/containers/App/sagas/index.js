import { fork } from 'redux-saga/effects';

import intercomSaga from './intercomSagas';

export function* appSaga() {
  yield fork(intercomSaga);
}

export default [appSaga];
