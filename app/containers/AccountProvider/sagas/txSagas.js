import { select, actionChannel, put, take, call } from 'redux-saga/effects';
import { Receipt } from 'poker-helper';
import { conf, ABI_PROXY } from '../../../app.config';
import { sendTx } from '../../../services/transactions';

import { getWeb3 } from '../utils';

import {
  CONTRACT_TX_SEND, ETH_TRANSFER,
  contractTxSuccess, contractTxError, transferETHSuccess, transferETHError,
} from '../actions';

const { ntzAddr } = conf();

function* contractTransactionSecureSend(action) {
  const { data } = action.payload;
  const state = yield select();
  const proxyAddr = yield call([state, state.getIn], ['account', 'proxy']);
  const injectedAddr = yield call([state, state.getIn], ['account', 'injected']);
  const web3 = yield call(getWeb3, true);
  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);

  return new Promise((resolve, reject) => {
    proxy.forward.estimateGas(
      ntzAddr,
      0,
      data,
      { from: injectedAddr },
      (gasErr, gas) => {
        if (gasErr) {
          reject(gasErr);
        } else {
          proxy.forward(
            ntzAddr,
            0,
            data,
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
    const { dest, key, data, privKey, callback = (() => null), args, methodName } = action.payload;

    const state = yield select();
    const isLocked = yield call([state, state.getIn], ['account', 'isLocked']);

    try {
      let txHash;
      if (isLocked) {
        const owner = yield call([state, state.getIn], ['account', 'owner']);
        const forwardReceipt = new Receipt(owner).forward(0, dest, 0, data).sign(privKey);
        const value = yield sendTx(forwardReceipt);
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

function* secureTransferETH(action) {
  const { payload: { dest, amount } } = action;
  const state = yield select();
  const proxyAddr = yield call([state, state.getIn], ['account', 'proxy']);
  const injectedAddr = yield call([state, state.getIn], ['account', 'injected']);

  const web3 = getWeb3(true);
  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);

  return new Promise((resolve, reject) => {
    proxy.forward.estimateGas(
      dest,
      `0x${amount.toString(16)}`,
      '',
      { from: injectedAddr },
      (gasErr, gas) => {
        proxy.forward.sendTransaction(
          dest,
          `0x${amount.toString(16)}`,
          '',
          { from: injectedAddr, gas: gas * 1.9 },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    );
  });
}

export function* transferETHSaga() {
  const transferChan = yield actionChannel(ETH_TRANSFER);
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(transferChan);
    const { payload: { dest, amount, callback = (() => null) } } = action;
    const state = yield select();
    const isLocked = yield call([state, state.getIn], ['account', 'isLocked']);

    try {
      let txHash;
      if (isLocked) {
        const owner = yield call([state, state.getIn], ['account', 'owner']);
        const privKey = state.get('account').get('privKey');
        const receipt = new Receipt(owner).forward(0, dest, amount, '').sign(privKey);
        const value = yield call(sendTx, receipt);
        txHash = value.txHash;
      } else {
        txHash = yield yield call(secureTransferETH, action);
      }

      yield call(callback, null, txHash);
      yield put(transferETHSuccess({ address: dest, amount, txHash }));
    } catch (err) {
      const error = (err.message) ? err.message : err;
      yield call(callback, error);
      yield put(transferETHError({ address: dest, amount, error }));
    }
  }
}
