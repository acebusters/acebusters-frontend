import { put, call } from 'redux-saga/effects';
import { conf } from '../../../app.config';
import { getWeb3 } from '../utils';
import { NETWORK_SUPPORT_UPDATE } from '../actions';

function getFirstBlockHash() {
  return new Promise((resolve, reject) => {
    const web3 = getWeb3(true);
    if (web3) {
      web3.eth.getBlock(0, (err, block) => {
        if (err) {
          reject(err);
        } else {
          resolve(block.hash);
        }
      });
    } else {
      reject('Smart contracts is not supported');
    }
  });
}

export function* unsupportedNetworkDetectSaga() {
  try {
    const hash = yield call(getFirstBlockHash);
    yield put({
      type: NETWORK_SUPPORT_UPDATE,
      payload: hash === conf().firstBlockHash,
    });
  } catch (err) {} // eslint-disable-line no-empty
}
