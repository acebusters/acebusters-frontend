import { select, actionChannel, put, take, call } from 'redux-saga/effects';
import { getWeb3 } from '../utils';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

import { CONTRACT_TX_SEND, contractTxSended, contractTxError } from '../actions';
import { makeSelectAccountData } from '../selectors';

function* contractTransactionSend({ payload }) {
  const { wallet } = yield select(makeSelectAccountData());
  const { data, dest } = payload;

  const sendRawTransaction = yield call(promisifyWeb3Call, getWeb3().eth.sendRawTransaction);
  const getTransactionCount = yield call(promisifyWeb3Call, getWeb3().eth.getTransactionCount);
  const getGasPrice = yield call(promisifyWeb3Call, getWeb3().eth.getGasPrice);
  const gas = yield payload.estimateGas;
  const nonce = yield call(getTransactionCount, wallet.address);
  const gasPrice = yield call(getGasPrice);

  const tx = {
    nonce,
    to: dest,
    from: wallet.address,
    value: '0x0',
    gasLimit: getWeb3().toHex(gas),
    gasPrice: getWeb3().toHex(gasPrice.toNumber()),
    data,
  };

  return yield call(sendRawTransaction, wallet.sign(tx));
}

export function* contractTransactionSendSaga() {
  const txChan = yield actionChannel(CONTRACT_TX_SEND);
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(txChan);
    const { dest, key, callback = (() => null), args, methodName } = action.payload;

    try {
      const txHash = yield yield call(contractTransactionSend, action);
      console.log(txHash);
      yield call(callback, null, txHash);
      yield put(contractTxSended({ address: dest, txHash, key, args, methodName }));
    } catch (err) {
      const error = err.message || err;
      yield call(callback, error);
      yield put(contractTxError({ address: dest, error, args, methodName, action }));
    }
  }
}
