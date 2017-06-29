import ethUtil from 'ethereumjs-util';
import { takeLatest, select, actionChannel, put, fork, take, takeEvery, call } from 'redux-saga/effects';
import { delay, eventChannel, END } from 'redux-saga';
import fetch from 'isomorphic-fetch';
import Raven from 'raven-js';
import { Receipt } from 'poker-helper';
import * as storageService from '../../services/localStorage';

import { createBlocky } from '../../services/blockies';
import { nickNameByAddress } from '../../services/nicknames';
import {
  conf,
  ABI_TOKEN_CONTRACT,
  ABI_CONTROLLER,
  ABI_ACCOUNT_FACTORY,
} from '../../app.config';

import { addEventsDate, getWeb3, isUserEvent } from './utils';

import {
  WEB3_CONNECT,
  WEB3_METHOD_CALL,
  CONTRACT_METHOD_CALL,
  CONTRACT_TX_SEND,
  SET_AUTH,
  WEB3_CONNECTED,
  ETH_TRANSFER,
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
  contractEvents,
  transferETHSuccess,
  transferETHError,
} from './actions';

export { getWeb3 } from './utils';

const confParams = conf();

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
    const factoryContract = web3.eth.contract(ABI_ACCOUNT_FACTORY).at(confParams.accountFactory);
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

    ws.on('connect', (e) => { // eslint-disable-line no-unused-vars
      // Note: when websocket first emit this connect event, it seems to be still not initialized yet.
      // and it could cause `accountLoginSaga` get called and throw an error in web3
      if (!firstConnect) {
        emitter(web3Connected({ web3: getWeb3(), isConnected: true }));
      }

      firstConnect = false;
    });

    // Note: if you just turn off the wifi, you won't get this close event immediately
    // It may take about 1 min to detect that connection loss
    // refer to:
    // 1. https://github.com/http-kit/http-kit/issues/111#issuecomment-32988134
    // 2. http://stackoverflow.com/questions/14227007/howto-detect-that-a-network-cable-has-been-unplugged-in-a-tcp-connection
    // FIXME: Websocket doen't seem to be back online after you lose connection first and then turn on your wifi again.
    ws.on('close', (e) => {  // eslint-disable-line no-unused-vars
      emitter(web3Disconnected());
    });

    ws.on('error', (e) => {
      emitter(web3Error(e));
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
    const tokenContract = getWeb3().eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
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

function* web3MethodCallSaga({ payload: { method, args, key } }) {
  try {
    const value = yield callMethod({ method, args });
    yield put(web3MethodSuccess({ key, payload: { value, updated: new Date() } }));
  } catch (err) {
    yield put(web3MethodError({ key, err }));
  }
}

function* contractMethodCallSaga({ payload: { method, args, key, address } }) {
  try {
    const value = yield callMethod({ method, args });
    yield put(contractMethodSuccess({ address, key, payload: { value, updated: new Date() } }));
  } catch (err) {
    yield put(contractMethodError({ address, key, err }));
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
      const res = yield getAccount(getWeb3(), signer);
      const proxy = res[0];
      const controller = res[1];
      const lastNonce = res[2].toNumber();
      const blocky = createBlocky(signer);
      const nickName = nickNameByAddress(signer);

      // write data into the state
      yield put(accountLoaded({ proxy, controller, lastNonce, blocky, nickName, signer }));

      // start listen on the account controller for events
      // mostly auth errors
      const controllerContract = getWeb3().eth.contract(ABI_CONTROLLER).at(controller);
      yield fork(ethEventListenerSaga, controllerContract);
    }
  }
}

function sendTx(forwardReceipt) {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.txUrl}/forward`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: `{ "forwardReceipt" : "${forwardReceipt}" }`,
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
    const action = yield take(txChan);
    const { dest, key, data, privKey, callback, args, methodName } = action.payload;
    const state = yield select();
    const nonce = state.get('account').get('lastNonce') + 1;
    const controller = state.get('account').get('controller');
    const forwardReceipt = new Receipt(controller).forward(nonce, dest, 0, data).sign(privKey);
    // send it.
    try {
      const value = yield sendTx(forwardReceipt);
      if (callback) {
        yield call(callback, null, value.txHash);
      }
      yield put(contractTxSuccess({ address: dest, nonce, txHash: value.txHash, key, args, methodName }));
    } catch (err) {
      const error = err.message || err;
      if (callback) {
        yield call(callback, error);
      }
      yield put(contractTxError({ address: dest, nonce, error, args, methodName, action }));
    }
  }
}

function* transferETHSaga() {
  const transferChan = yield actionChannel(ETH_TRANSFER);
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: { dest, amount } } = yield take(transferChan);
    const state = yield select();
    const nonce = state.get('account').get('lastNonce') + 1;
    const controller = state.get('account').get('controller');
    const privKey = state.get('account').get('privKey');
    const receipt = new Receipt(controller).forward(nonce, dest, amount, '').sign(privKey);

    try {
      const value = yield sendTx(receipt);
      yield put(transferETHSuccess({ address: dest, nonce, amount, txHash: value.txHash }));
    } catch (err) {
      const error = (err.message) ? err.message : err;
      yield put(transferETHError({ address: dest, amount, nonce, error }));
    }
  }
}

function* updateLoggedInStatusSaga(action) { // SET_AUTH action
  if (!action.newAuthState.loggedIn) {
    storageService.removeItem('privKey');
    storageService.removeItem('email');
  } else {
    Raven.setUserContext({
      email: action.newAuthState.email,
    });
    storageService.setItem('privKey', action.newAuthState.privKey);
    storageService.setItem('email', action.newAuthState.email);
  }
}

const ethEvent = (contract) => eventChannel((emitter) => {
  const events = contract.allEvents({ fromBlock: 'latest' });
  events.watch((error, results) => {
    if (error) {
      emitter(END);
      events.stopWatching();
      return;
    }
    emitter(results);
  });
  return () => {
    events.stopWatching();
  };
});

export function* ethEventListenerSaga(contract) {
  const chan = yield call(ethEvent, contract);
  while (true) { // eslint-disable-line no-constant-condition
    try {
      const event = yield take(chan);
      const state = yield select();
      const proxy = state.getIn(['account', 'proxy']);
      if (isUserEvent(proxy)(event)) {
        const events = yield call(addEventsDate, [event]);
        yield put(contractEvents(events, proxy));
      }
    } catch (e) {} // eslint-disable-line no-empty
  }
}

// The root saga is what is sent to Redux's middleware.
export function* accountSaga() {
  yield takeLatest(WEB3_CONNECT, web3ConnectSaga);
  yield takeEvery(WEB3_METHOD_CALL, web3MethodCallSaga);
  yield takeEvery(CONTRACT_METHOD_CALL, contractMethodCallSaga);
  yield takeEvery(SET_AUTH, updateLoggedInStatusSaga);
  yield fork(websocketSaga);
  yield fork(transferETHSaga);
  yield fork(accountLoginSaga);
  yield fork(contractTransactionSendSaga);
}

export default [
  accountSaga,
];
