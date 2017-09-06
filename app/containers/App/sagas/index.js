import { fork, takeEvery } from 'redux-saga/effects';

import { ACCOUNT_LOADED } from '../../AccountProvider/actions';

import intercomSaga from './intercomSagas';
import gtmSaga from './gtmSagas';
import unsupportedModalSaga from './unsupportedModalSaga';


export function* appSaga() {
  yield fork(intercomSaga);
  yield fork(gtmSaga);
  yield takeEvery(ACCOUNT_LOADED, unsupportedModalSaga);
}

export default [appSaga];
