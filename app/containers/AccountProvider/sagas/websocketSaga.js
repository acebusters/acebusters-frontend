import { put, take, call } from 'redux-saga/effects';
import { eventChannel, delay } from 'redux-saga';

import { getWeb3 } from '../utils';
import { web3Connected, web3Disconnected } from '../actions';

function wsEvents(ws, emitter) {
  ws.on('connect', async (e) => { // eslint-disable-line no-unused-vars
    emitter(web3Connected({ isConnected: true }));
  });

  ws.on('close', async (e) => {  // eslint-disable-line no-unused-vars
    emitter(web3Disconnected());
    ws = undefined; // eslint-disable-line
    // try to reconnect
    while (true) { // eslint-disable-line
      try {
        if (window.navigator.onLine) {
          const web3 = getWeb3(false, true);
          wsEvents(web3.currentProvider, emitter);
          break;
        }
      } finally {
        await delay(1000); // eslint-disable-line
      }
    }
  });

  // ws.on('error', (e) => {
  //   emitter(web3Error(e));
  // });
}

function websocketChannel() {
  return eventChannel((emitter) => {
    wsEvents(getWeb3().currentProvider, emitter);
    return () => {
      getWeb3().currentProvider.reset();
    };
  });
}

export function* websocketSaga() {
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
