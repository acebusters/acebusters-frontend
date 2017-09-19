import { takeEvery, take, call } from 'redux-saga/effects';

import * as reservationService from '../../../services/reservationService';
import { CONTRACT_TX_APPEARED } from '../../AccountProvider/actions';

import { RESERVE_SEAT } from '../actions';

function* reserve({ payload: { tableAddr, pos, signerAddr, txHash, amount } }) {
  yield take((action) => action.type === CONTRACT_TX_APPEARED && action.meta && action.meta.txHash === txHash);
  yield call(reservationService.reserve, tableAddr, pos, signerAddr, txHash, amount);
}

export function* reservationSaga() {
  yield takeEvery(RESERVE_SEAT, reserve);
}
