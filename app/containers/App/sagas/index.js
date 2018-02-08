import { fork, takeEvery } from 'redux-saga/effects';

import { ACCOUNT_LOADED } from '../../AccountProvider/actions';

import gtmSaga from './gtmSagas';
import unsupportedModalSaga from './unsupportedModalSaga';
import balancesLoadingSaga from './balancesLoadingSaga';

export function* appSaga(dispatch) {
  yield fork(gtmSaga);
  yield fork(balancesLoadingSaga, dispatch);
  yield takeEvery(ACCOUNT_LOADED, unsupportedModalSaga);
}

export default [appSaga];
