import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { conf } from '../../../app.config';
import { getWeb3 } from '../utils';
import { NETWORK_SUPPORT_UPDATE } from '../actions';

function getFirstBlockHash(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(0, (err, block) => {
      if (err) {
        reject(err);
      } else {
        resolve(block.hash);
      }
    });
  });
}

export function* unsupportedNetworkDetectSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const web3 = getWeb3(true);
    if (web3) {
      try {
        const hash = yield call(getFirstBlockHash, web3);
        yield put({
          type: NETWORK_SUPPORT_UPDATE,
          payload: hash === conf().firstBlockHash,
        });
        break;
      } catch (err) {} // eslint-disable-line no-empty
    } else {
      yield call(delay, 2000);
    }
  }
}
