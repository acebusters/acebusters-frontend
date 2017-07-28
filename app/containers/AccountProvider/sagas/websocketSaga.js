import { put, take, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { getWeb3 } from '../utils';

import { web3Error, web3Connected, web3Disconnected } from '../actions';

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
