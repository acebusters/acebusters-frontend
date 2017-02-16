import Web3 from 'web3';
import { takeLatest, put, fork, take } from 'redux-saga/effects';

import { ethNodeUrl } from '../../app.config';
import { WEB3_CONNECT, WEB3_METHOD_CALL } from './constants';
import {
  web3Connected,
  web3Disconnected,
  web3MethodSuccess,
  web3MethodError,
} from './actions';

let web3Instance;

export function getWeb3() {
  if (typeof web3Instance === 'undefined') {
    web3Instance = new Web3(new Web3.providers.HttpProvider(ethNodeUrl));
  }
  return web3Instance;
}

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
  try {
    yield getPeerCount(getWeb3());
    yield put(web3Connected({ isConnected: true }));
  } catch (err) {
    yield put(web3Disconnected({ isConnected: false, error: err }));
  }
}

// TODO handle errors
function callMethod({ method, args }) {
  return new Promise((resolve, reject) => {
    try {
      method(...args, (err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function* web3MethodCallSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const call = yield take(WEB3_METHOD_CALL);
    const { method, networkId, args, key } = call.payload;

    try {
      const value = yield callMethod({ method, args });
      yield put(web3MethodSuccess({ key, payload: { value, updated: new Date() } }));
    } catch (err) {
      yield put(web3MethodError({ networkId, key, err }));
    }
  }
}

// The root saga is what is sent to Redux's middleware.
export function* accountSaga() {
  yield takeLatest(WEB3_CONNECT, web3ConnectSaga);
  yield fork(web3MethodCallSaga);
}

export default [
  accountSaga,
];
