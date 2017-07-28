import { put, fork, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { conf, ABI_TOKEN_CONTRACT } from '../../../app.config';

import { getWeb3 } from '../utils';

import { web3Connected, web3Disconnected } from '../actions';
import { ethEventListenerSaga } from './ethEventListenerSaga';

const getPeerCount = (web3) => (
  new Promise((resolve, reject) => {
    web3.net.getPeerCount((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })
);

export function* web3ConnectSaga() {
  try {
    yield getPeerCount(getWeb3());
    yield put(web3Connected({ isConnected: true }));
    const tokenContract = getWeb3().eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
    yield call(delay, 500);
    yield fork(ethEventListenerSaga, tokenContract);
  } catch (err) {
    yield put(web3Disconnected({ isConnected: false, error: err }));
  }
}
