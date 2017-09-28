import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { setItem, getItem } from '../../../services/localStorage';

import { CONTRACT_TX_SENDED, CONTRACT_TX_MINED, CONTRACT_TX_FAILED, CONTRACT_TX_NOT_EXISTS, contractTxSended } from '../../AccountProvider/actions';

const STORAGE_KEY = 'pending_transactions';

function getTransactions() {
  const transactions = getItem(STORAGE_KEY);
  if (transactions) {
    return JSON.parse(transactions);
  }

  return {};
}

function* saveTransaction({ payload }) {
  const transactions = yield call(getTransactions);
  transactions[payload.txHash] = payload;
  yield call(setItem, STORAGE_KEY, JSON.stringify(transactions));
}

function* removeTransaction({ meta: { txHash } }) {
  const transactions = yield call(getTransactions);
  delete transactions[txHash];
  yield call(setItem, STORAGE_KEY, JSON.stringify(transactions));
}

function* restoreTransactions() {
  const transactions = yield call(getTransactions);
  const hashes = Object.keys(transactions);

  for (let i = 0; i < hashes.length; i += 1) {
    yield put(contractTxSended(transactions[hashes[i]]));
  }
}

export function* persistentTxSaga() {
  yield fork(restoreTransactions);
  yield takeEvery(CONTRACT_TX_SENDED, saveTransaction);
  yield takeEvery([CONTRACT_TX_MINED, CONTRACT_TX_NOT_EXISTS, CONTRACT_TX_FAILED], removeTransaction);
}
