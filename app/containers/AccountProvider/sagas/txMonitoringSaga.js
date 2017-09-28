import { delay } from 'redux-saga';
import { call, put, takeEvery, fork } from 'redux-saga/effects';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';
import { waitForTx } from '../../../utils/waitForTx';
import { getWeb3 } from '../utils';
import { contractTxNotExists, contractTxFailed, contractTxMined, contractTxAppeared, CONTRACT_TX_SENDED } from '../actions';

const TX_TIMEOUT = 10000;
const TX_CHECK_DELAY = 500;

function* getTransaction(txHash) {
  const web3 = yield call(getWeb3);
  const getTx = promisifyWeb3Call(web3.eth.getTransaction);

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

function* txMonitoring(txHash) {
  try {
    yield call(getTransaction, txHash);
    yield put(contractTxAppeared(txHash));
    yield call(waitForTxMined, txHash);
    yield put(contractTxMined(txHash));
  } catch (err) {
    yield put(err);
  }
}

export function* txMonitoringSaga() {
  yield takeEvery(CONTRACT_TX_SENDED, function* (action) { // eslint-disable-line func-names
    yield fork(txMonitoring, action.payload.txHash);
  });
}
