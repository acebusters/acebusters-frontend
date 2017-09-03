import { select, actionChannel, put, take, call } from 'redux-saga/effects';
import { Receipt } from 'poker-helper';
import BigNumber from 'bignumber.js';
import { ABI_PROXY } from '../../../app.config';
import { last } from '../../../utils';
import { promisifyContractCall } from '../../../utils/promisifyContractCall';
import { sendTx } from '../../../services/transactions';

import { getWeb3 } from '../utils';

import { CONTRACT_TX_SEND, contractTxSended, contractTxError } from '../actions';
import { makeSelectAccountData } from '../selectors';

function getTxArgs({ data, dest, args, methodName }) {
  const isForward = !data && methodName === 'forward';
  const options = typeof last(args) === 'function' ? args[args.length - 2] : last(args);
  return isForward ? args.slice(0, 3) : [dest, options.value || new BigNumber(0), data];
}

function* contractTransactionSend(action) {
  const { proxy: proxyAddr, injected: injectedAddr, isLocked, owner } = yield select(makeSelectAccountData());
  const txArgs = yield call(getTxArgs, action.payload);

  if (isLocked) {
    const forwardReceipt = new Receipt(owner).forward(0, ...txArgs).sign(action.payload.privKey);
    const value = yield call(sendTx, forwardReceipt);
    return value.txHash;
  }

  const web3 = yield call(getWeb3, true);
  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
  const estimateGas = yield call(promisifyContractCall, proxy.forward.estimateGas);
  const sendTransaction = yield call(promisifyContractCall, proxy.forward.sendTransaction);
  const gas = yield call(estimateGas, ...txArgs, { from: injectedAddr });

  return yield call(sendTransaction, ...txArgs, { from: injectedAddr, gas: Math.round(gas * 1.9) });
}

export function* contractTransactionSendSaga() {
  const txChan = yield actionChannel(CONTRACT_TX_SEND);
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(txChan);
    const { dest, key, callback = (() => null), args, methodName } = action.payload;

    try {
      const txHash = yield yield call(contractTransactionSend, action);
      yield call(callback, null, txHash);
      yield put(contractTxSended({ address: dest, txHash, key, args, methodName }));
    } catch (err) {
      const error = err.message || err;
      yield call(callback, error);
      yield put(contractTxError({ address: dest, error, args, methodName, action }));
    }
  }
}
