import { fork } from 'redux-saga/effects';

import intercomSaga from './intercomSagas';
import gtmSaga from './gtmSagas';

export function* appSaga() {
  yield fork(intercomSaga);
  yield fork(gtmSaga);
}

export default [appSaga];
