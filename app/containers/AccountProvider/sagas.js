import Web3 from 'web3';
import ethUtil from 'ethereumjs-util';
import { takeLatest, select, actionChannel, put, fork, take, call, cancelled } from 'redux-saga/effects';
import { delay, eventChannel, END } from 'redux-saga';
import fetch from 'isomorphic-fetch';
import Raven from 'raven-js';

import WebsocketProvider from '../../services/wsProvider';
import {
  ethNodeUrl,
  ABI_TOKEN_CONTRACT,
  ABI_CONTROLLER,
  tokenContractAddress,
  ABI_ACCOUNT_FACTORY,
  accountFactoryAddress,
} from '../../app.config';

import {
  WEB3_CONNECT,
  WEB3_METHOD_CALL,
  CONTRACT_METHOD_CALL,
  CONTRACT_TX_SEND,
  SET_AUTH,
  WEB3_CONNECTED,
  BLOCK_NOTIFY,
  web3Error,
  web3Connected,
  web3Disconnected,
  web3MethodSuccess,
  web3MethodError,
  accountLoaded,
  contractMethodSuccess,
  contractMethodError,
  contractTxSuccess,
  contractTxError,
  contractEvent,
} from './actions';

let web3Instance;

export function getWeb3() {
  if (typeof web3Instance === 'undefined') {
    web3Instance = new Web3(new WebsocketProvider(ethNodeUrl));
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

const getAccount = (web3, signer) => (
  new Promise((resolve, reject) => {
    const factoryContract = web3.eth.contract(ABI_ACCOUNT_FACTORY).at(accountFactoryAddress);
    factoryContract.getAccount.call(signer, (e, a) => {
      if (e) {
        reject('login error');
      }
      resolve(a);
    });
  })
);

function websocketChannel() {
  return eventChannel((emitter) => {
    const ws = getWeb3().currentProvider;
    let firstConnect = true;

    ws.on('connect', (e, oldCallback) => {
      // Note: when websocket first emit this connect event, it seems to be still not initialized yet.
      // and it could cause `accountLoginSaga` get called and throw an error in web3
      if (!firstConnect) {
        emitter(web3Connected({ web3: web3Instance, isConnected: true }));
      }

      // Note: wsProvider has some default behavior for all these events.
      // it's better to keep the old callback
      oldCallback();
      firstConnect = false;
    });

    // Note: if you just turn off the wifi, you won't get this close event immediately
    // It may take about 1 min to detect that connection loss
    // refer to:
    // 1. https://github.com/http-kit/http-kit/issues/111#issuecomment-32988134
    // 2. http://stackoverflow.com/questions/14227007/howto-detect-that-a-network-cable-has-been-unplugged-in-a-tcp-connection
    // FIXME: Websocket doen't seem to be back online after you lose connection first and then turn on your wifi again.
    ws.on('close', (e, oldCallback) => {
      emitter(web3Disconnected());
      oldCallback();
    });

    ws.on('error', (e, oldCallback) => {
      emitter(web3Error(e));
      oldCallback();
    });

    return () => {
      ws.reset();
    };
  });
}

function* websocketSaga() {
  const chan = yield call(websocketChannel);
  try {
    while (true) { // eslint-disable-line no-constant-condition
      const action = yield take(chan);
      yield put(action);
    }
  } finally {
    chan.close();
  }
}

function* web3ConnectSaga() {
  try {
    yield getPeerCount(getWeb3());
    yield put(web3Connected({ isConnected: true }));
    const tokenContract = web3Instance.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    yield call(delay, 500);
    yield fork(ethEventListenerSaga, tokenContract);
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
    const req = yield take(WEB3_METHOD_CALL);
    const { method, args, key } = req.payload;

    try {
      const value = yield callMethod({ method, args });
      yield put(web3MethodSuccess({ key, payload: { value, updated: new Date() } }));
    } catch (err) {
      yield put(web3MethodError({ key, err }));
    }
  }
}

function* contractMethodCallSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const req = yield take(CONTRACT_METHOD_CALL);
    const { method, args, key, address } = req.payload;

    try {
      const value = yield callMethod({ method, args });
      yield put(contractMethodSuccess({ address, key, payload: { value, updated: new Date() } }));
    } catch (err) {
      yield put(contractMethodError({ address, key, err }));
    }
  }
}

function* accountLoginSaga() {
  let initialLoad = true;
  while (true) { // eslint-disable-line no-constant-condition
    let req;
    // load account data when page is loaded,
    // and user is already logged in from session storage
    if (initialLoad) {
      initialLoad = false;
      const results = yield [select(), take(WEB3_CONNECTED)];
      const privKey = results[0].get('account').get('privKey');
      if (privKey !== undefined && privKey.length > 32) {
        req = { newAuthState: { privKey, loggedIn: true } };
      } else {
        continue; // eslint-disable-line no-continue
      }
    } else {
      // or wait for user login success to happen
      req = yield take(SET_AUTH);
    }

    const { privKey, loggedIn } = req.newAuthState;
    if (loggedIn) {
      const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
      const signer = `0x${ethUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
      Raven.setUserContext({
        id: signer,
      });
      // this reads account data from the account factory
      const res = yield getAccount(web3Instance, signer);
      const proxy = res[0];
      const controller = res[1];
      const lastNonce = res[2].toNumber();

      // write data into the state
      yield put(accountLoaded({ proxy, controller, lastNonce }));

      // start listen on the account controller for events
      // mostly auth errors
      const controllerContract = web3Instance.eth.contract(ABI_CONTROLLER).at(controller);
      yield fork(ethEventListenerSaga, controllerContract);
    }
  }
}

const workerUrl = 'https://khengvfg6c.execute-api.eu-west-1.amazonaws.com/v0';

function sendTx(signer, nonceAndDest, data, r, s, v) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify({ signer, nonceAndDest, data, r, s, v });
    fetch(`${workerUrl}/forward`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: bodyStr,
    }).then((rsp) => {
      rsp.json().then((response) => {
        if (rsp.status >= 200 && rsp.status < 300) {
          resolve(response);
        } else {
          reject({
            status: rsp.status,
            message: response,
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function notifyBlock() {
  return new Promise((resolve, reject) => {
    fetch(`${workerUrl}/notify`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: '{}',
    }).then((rsp) => {
      rsp.json().then((response) => {
        if (rsp.status >= 200 && rsp.status < 300) {
          resolve(response);
        } else {
          reject({
            status: rsp.status,
            message: response,
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

function* contractTransactionSendSaga() {
  const txChan = yield actionChannel(CONTRACT_TX_SEND);
  while (true) { // eslint-disable-line no-constant-condition
    const req = yield take(txChan);
    const { dest, key, data, privKey } = req.payload;
    const dataHex = data.replace('0x', '');
    const destHex = dest.replace('0x', '');
    const privHex = privKey.replace('0x', '');

    const state = yield select();
    const nonce = state.get('account').get('lastNonce') + 1;
    // sign the receipt.
    const payload = new Buffer(32 + (dataHex.length / 2));
    payload.fill(0);
    payload.writeUInt32BE(nonce, 8);
    payload.write(destHex, 12, 20, 'hex');
    payload.write(dataHex, 32, 'hex');
    const priv = new Buffer(privHex, 'hex');
    const signer = `0x${ethUtil.privateToAddress(priv).toString('hex')}`;
    const hash = ethUtil.sha3(payload);
    const sig = ethUtil.ecsign(hash, priv);
    // send it.
    try {
      const value = yield sendTx(
        signer,
        `0x${payload.toString('hex', 0, 32)}`,
        data,
        `0x${sig.r.toString('hex')}`,
        `0x${sig.s.toString('hex')}`,
        sig.v);
      yield put(contractTxSuccess({ address: dest, nonce, txHash: value.txHash, key }));
    } catch (err) {
      const error = (err.message) ? err.message : err;
      yield put(contractTxError({ address: dest, nonce, error }));
    }
  }
}


const ethEvent = (contract) => eventChannel((emitter) => {
  const contractEvents = contract.allEvents({ fromBlock: 'latest' });
  contractEvents.watch((error, results) => {
    if (error) {
      emitter(END);
      contractEvents.stopWatching();
      return;
    }
    emitter(results);
  });
  return () => {
    contractEvents.stopWatching();
  };
});

export function* ethEventListenerSaga(contract) {
  const chan = yield call(ethEvent, contract);
  try {
    const event = yield take(chan);
    yield put(contractEvent({ event }));
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

// The root saga is what is sent to Redux's middleware.
export function* accountSaga() {
  yield takeLatest(WEB3_CONNECT, web3ConnectSaga);
  yield takeLatest(BLOCK_NOTIFY, notifyBlock);
  yield fork(websocketSaga);
  yield fork(web3MethodCallSaga);
  yield fork(accountLoginSaga);
  yield fork(contractMethodCallSaga);
  yield fork(contractTransactionSendSaga);
}

export default [
  accountSaga,
];
