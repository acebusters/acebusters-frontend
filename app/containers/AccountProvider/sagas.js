import Web3 from 'web3';
import { takeLatest, put } from 'redux-saga/effects';

import { ethNodeUrl } from '../../app.config';
import { WEB3_CONNECT } from './constants';
import { web3Connected, web3Disconnected } from './actions';

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

function* web3ConnectSaga() {
  let web3 = window.web3;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(ethNodeUrl));
  }
  window.web3 = web3;

  try {
    yield getPeerCount(web3);
    yield put(web3Connected({ isConnected: false }));
  } catch (err) {
    yield put(web3Disconnected({ isConnected: false, error: err }));
  }
}

// The root saga is what is sent to Redux's middleware.
export function* accountSaga() {
  yield takeLatest(WEB3_CONNECT, web3ConnectSaga);
}

export default [
  accountSaga,
];
