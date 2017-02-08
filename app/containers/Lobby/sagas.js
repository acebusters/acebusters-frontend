/**
 * Created by helge on 08.02.17.
 */

import web3 from 'web3';
import { call, put, takeLatest } from 'redux-saga/effects';
import { apiBasePath, tokenContractAddress, ABI_TOKEN_CONTRACT } from '../../app.config';
import { GET_BALANCE, GET_TABLES, balanceUpdated,
                                  balanceUpdateError,
                                  tablesUpdated,
                                  tablesUpdateError } from './actions';

function balanceRequest(address) {
  const contract = web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
  const baseUnit = contract.baseUnit();

  const promise = new Promise((resolve, reject) => {
    contract.balanceOf(address, (err, amount) => {
      if (err) {
        reject(err);
      }
      const balance = amount.toNumber() / (10 ** baseUnit.toNumber());
      resolve({ balance });
    });
  });

  return promise;
}

function tablesRequest() {
  const request = new Request(`${apiBasePath}/config`);
  const promise = fetch(request).then(
    (res) => res.json(),
    (err) => err
  ).then(
    (tables) => tables,
    (err) => err
  );
  return promise;
}

export function* getBalance(action) {
  try {
    const balance = yield call(balanceRequest, action.address);
    yield put(balanceUpdated(balance));
  } catch (err) {
    yield put(balanceUpdateError(err));
  }
}

export function* getTables() {
  try {
    const tables = yield call(tablesRequest);
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
