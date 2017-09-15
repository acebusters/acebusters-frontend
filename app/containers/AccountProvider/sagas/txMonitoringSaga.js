import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { promisifyContractCall } from '../../../utils/promisifyContractCall';
import { waitForTx } from '../../../utils/waitForTx';
import { getWeb3 } from '../utils';
import { contractTxNotExists, contractTxFailed, contractTxMined } from '../actions';

const TX_TIMEOUT = 5000;
const TX_CHECK_DELAY = 500;

function* getTransaction(txHash) {
  const web3 = yield call(getWeb3);
  const getTx = promisifyContractCall(web3.eth.getTransaction);

  try {
    for (let i = 0; i <= Math.ceil(TX_TIMEOUT / TX_CHECK_DELAY); i += 1) {
      const tx = yield call(getTx, txHash);

      if (tx) {
        return tx;
      }

      yield call(delay, TX_CHECK_DELAY);
    }
  } catch (err) {
    throw contractTxNotExists({ message: err.message }, txHash);
  }

  throw contractTxNotExists({ message: 'Transaction doesn\'t exists;' }, txHash);
}

function* waitForTxMined(txHash) {
  const web3 = yield call(getWeb3);
  try {
    return yield waitForTx(web3, txHash);
  } catch (err) {
    throw contractTxFailed({ message: err.message }, txHash);
  }
}

export function* txMonitoringSaga(action) {
  const { txHash } = action.payload;
  try {
    yield call(getTransaction, txHash);
    yield call(waitForTxMined, txHash);
    yield put(contractTxMined(txHash));
  } catch (err) {
    yield put(err);
  }
}
