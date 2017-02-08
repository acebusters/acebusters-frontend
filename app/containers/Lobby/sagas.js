/**
 * Created by helge on 08.02.17.
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { getTablesRequest, getBalanceRequest } from '../../services/lobby';
import { GET_BALANCE,
         GET_TABLES,
         balanceUpdated,
         balanceUpdateError,
         tablesUpdated,
         tablesUpdateError } from './actions';


export function* getBalance(action) {
  try {
    const balance = yield call(getBalanceRequest, action.address);
    yield put(balanceUpdated(balance));
  } catch (err) {
    yield put(balanceUpdateError(err));
  }
}

export function* getTables() {
  try {
    const tables = yield call(getTablesRequest);
    yield put(tablesUpdated(tables));
  } catch (err) {
    yield put(tablesUpdateError(err));
  }
}

export function* lobbySaga() {
  yield takeLatest(GET_BALANCE, getBalance);
  yield takeLatest(GET_TABLES, getTables);
}

export default lobbySaga;
