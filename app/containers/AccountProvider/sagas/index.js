import { takeLatest, fork, takeEvery } from 'redux-saga/effects';

import { WEB3_CONNECT, WEB3_METHOD_CALL, CONTRACT_METHOD_CALL, SET_AUTH } from '../actions';

import { injectedWeb3ListenerSaga } from './injectedWeb3ListenerSaga';
import { accountLoginSaga } from './accountLoginSaga';
import { websocketSaga } from './websocketSaga';
import { web3ConnectSaga } from './web3ConnectSaga';
import { unsupportedNetworkDetectSaga } from './unsupportedNetworkDetectSaga';
import { updateLoggedInStatusSaga } from './updateLoggedInStatusSaga';
import { web3MethodCallSaga, contractMethodCallSaga } from './web3CallsSagas';
import { contractTransactionSendSaga } from './txSagas';
import intercomSaga from './intercomSagas';

export { getWeb3 } from '../utils';

// The root saga is what is sent to Redux's middleware.
export function* accountSaga() {
  yield takeLatest(WEB3_CONNECT, web3ConnectSaga);
  yield takeEvery(WEB3_METHOD_CALL, web3MethodCallSaga);
  yield takeEvery(CONTRACT_METHOD_CALL, contractMethodCallSaga);
  yield takeEvery(SET_AUTH, updateLoggedInStatusSaga);
  yield fork(websocketSaga);
  yield fork(accountLoginSaga);
  yield fork(contractTransactionSendSaga);
  yield fork(injectedWeb3ListenerSaga);
  yield fork(unsupportedNetworkDetectSaga);
  yield fork(intercomSaga);
}

export default [
  accountSaga,
];
