import { fork } from 'redux-saga/effects';

import gtmSaga from './gtmSagas';
import balancesLoadingSaga from './balancesLoadingSaga';

export function* appSaga(dispatch) {
  yield fork(gtmSaga);
  yield fork(balancesLoadingSaga, dispatch);
}

export default [appSaga];
