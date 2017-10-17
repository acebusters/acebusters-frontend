import { eventChannel } from 'redux-saga';
import { select, actionChannel, put, take, call } from 'redux-saga/effects';
import Pusher from 'pusher-js';
import { Receipt } from 'poker-helper';
import BigNumber from 'bignumber.js';
import { conf, ABI_PROXY } from '../../../app.config';
import { last } from '../../../utils';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';
import { sendTx } from '../../../services/transactions';

import { getWeb3 } from '../utils';

import { CONTRACT_TX_SEND, contractTxSended, contractTxError } from '../actions';
import { makeSelectAccountData } from '../selectors';

function getTxArgs({ data, dest, args, methodName }) {
  const isForward = !data && methodName === 'forward';
  const options = typeof last(args) === 'function' ? args[args.length - 2] : last(args);
  return isForward ? args.slice(0, 3) : [dest, options.value || new BigNumber(0), data];
}

function* contractTransactionSend({ payload }) {
  const { proxy: proxyAddr, injected: injectedAddr, isLocked, owner, signerAddr } = yield select(makeSelectAccountData());
  const txArgs = yield call(getTxArgs, payload);

  if (isLocked) {
    const forwardReceipt = new Receipt(owner).forward(0, ...txArgs).sign(payload.privKey);
    const txHashChannel = fishTxHashChannel(signerAddr);
    yield call(sendTx, forwardReceipt);
    const txHash = yield take(txHashChannel);
    txHashChannel.close();
    return txHash;
  }

  const web3 = yield call(getWeb3, true);
  const proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);
  const sendTransaction = yield call(promisifyWeb3Call, proxy.forward.sendTransaction);
  const gas = yield payload.estimateGas;

  return yield call(sendTransaction, ...txArgs, { from: injectedAddr, gas });
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

function fishTxHashChannel(signerAddr) {
  const pusher = new Pusher(conf().pusherApiKey, { cluster: 'eu', encrypted: true });
  const signerChannel = pusher.subscribe(signerAddr);
  signerChannel.bind('update', () => null); // workaround for subscribe on updates before the receipt sending
  return eventChannel((emitter) => {
    signerChannel.bind('update', (event) => {
      if (event.type === 'txHash') {
        emitter(event.payload);
      }
    });

    return () => {
      signerChannel.unbind_all();
    };
  });
}
