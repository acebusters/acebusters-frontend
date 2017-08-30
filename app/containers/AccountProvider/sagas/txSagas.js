import { select, actionChannel, put, take, call } from 'redux-saga/effects';
import { Receipt } from 'poker-helper';
import BigNumber from 'bignumber.js';
import { ABI_PROXY } from '../../../app.config';
import { last } from '../../../utils';
import { sendTx } from '../../../services/transactions';

import { getWeb3 } from '../utils';

import { CONTRACT_TX_SEND, contractTxSuccess, contractTxError } from '../actions';
import { makeSelectAccountData } from '../selectors';

function getTxArgs({ data, dest, args, methodName }) {
  const isForward = !data && methodName === 'forward';
  const options = typeof last(args) === 'function' ? args[args.length - 2] : last(args);
  return isForward ? args.slice(0, 3) : [dest, options.value || new BigNumber(0), data];
}

function* contractTransactionSecureSend(action) {
  const { proxy: proxyAddr, injected: injectedAddr } = yield select(makeSelectAccountData());
  const web3 = yield call(getWeb3, true);
  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
  const txArgs = yield call(getTxArgs, action.payload);

  return new Promise((resolve, reject) => {
    proxy.forward.estimateGas(
      ...txArgs,
      { from: injectedAddr },
      (gasErr, gas) => {
        if (gasErr) {
          reject(gasErr);
        } else {
          proxy.forward(
            ...txArgs,
            { from: injectedAddr, gas: Math.round(gas * 1.9) },
            (forwardErr, result) => {
              if (forwardErr) {
                reject(forwardErr);
              } else {
                resolve(result);
              }
            }
          );
        }
      }
    );
  });
}

export function* contractTransactionSendSaga() {
  const txChan = yield actionChannel(CONTRACT_TX_SEND);
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(txChan);
    const { dest, key, privKey, callback = (() => null), args, methodName } = action.payload;

    const state = yield select();
    const isLocked = yield call([state, state.getIn], ['account', 'isLocked']);

    try {
      let txHash;
      if (isLocked) {
        const txArgs = yield call(getTxArgs, action.payload);
        const owner = yield call([state, state.getIn], ['account', 'owner']);
        const forwardReceipt = new Receipt(owner).forward(0, ...txArgs).sign(privKey);
        const value = yield call(sendTx, forwardReceipt);
        txHash = value.txHash;
      } else {
        // two yields to wait for returned promise
        txHash = yield yield call(contractTransactionSecureSend, action);
      }
      yield call(callback, null, txHash);
      yield put(contractTxSuccess({ address: dest, txHash, key, args, methodName }));
    } catch (err) {
      const error = err.message || err;
      yield call(callback, error);
      yield put(contractTxError({ address: dest, error, args, methodName, action }));
    }
  }
}
