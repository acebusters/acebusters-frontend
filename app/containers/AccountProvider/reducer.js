import { fromJS } from 'immutable';

import {
  SET_AUTH,
  SET_BALANCE,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED,
  WEB3_METHOD_SUCCESS,
  WEB3_METHOD_ERROR,
  CONTRACT_METHOD_SUCCESS,
  CONTRACT_METHOD_ERROR,
  CONTRACT_TX_SEND,
  CONTRACT_TX_SUCCESS,
  CONTRACT_TX_ERROR,
} from './constants';
import * as storageService from '../../services/localStorage';

const isLoggedIn = () => {
  const privKey = storageService.getItem('privKey');
  return (privKey !== undefined && privKey.length > 32);
};

// The initial application state
const initialState = fromJS({
  privKey: storageService.getItem('privKey'),
  email: storageService.getItem('email'),
  lastNonce: 3,
  '0xc5fe8ed3c565fdcad79c7b85d68378aa4b68699e': {
    pending: {
      1: { data: 'send([2000, "0x123"])', txHash: '0x6019e766698d45aed16c1891f3edda08184b2b3babd92c0dc7a06a9b6d27140a' },
      2: { data: 'send([3000, "0x345"])', txHash: '0x51fda47ac9113cdd7068e9bb7dec55cb170d1ca694afd442f77a56add4b3c86b' },
      3: { data: 'send([4000, "0x345"])', error: 'Error: invalid nonec' },
    },
  },
  loggedIn: isLoggedIn(),
});

function accountProviderReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case WEB3_CONNECTED:
      return state;
    case WEB3_DISCONNECTED:
      return state;
    case WEB3_METHOD_SUCCESS:
      return state.setIn(['web3', 'methods', action.key], fromJS(action.payload));
    case WEB3_METHOD_ERROR:
      return state;
    case CONTRACT_METHOD_SUCCESS:
      if (state.get(action.address)) {
        return state.setIn([action.address, 'methods', action.key], fromJS(action.payload));
      }
      return state.setIn([action.address, 'methods'], fromJS({ [action.key]: action.payload }));
    case CONTRACT_METHOD_ERROR:
      return state;
    case CONTRACT_TX_SEND:
      newState = state.setIn([action.payload.dest, 'pending', action.payload.nonce, 'call'], action.payload.key);
      return newState.set('lastNonce', action.payload.nonce);
    case CONTRACT_TX_SUCCESS:
      return state.setIn([action.address, 'pending', action.nonce, 'txHash'], action.txHash);
    case CONTRACT_TX_ERROR:
      return state.setIn([action.address, 'pending', action.nonce, 'error'], action.error);
    case SET_BALANCE:
      return state.set('balance', action.newBal);
    case SET_AUTH:
      if (!action.newAuthState.loggedIn) {
        newState = state
          .delete('privKey')
          .delete('email');
        storageService.removeItem('privKey');
        storageService.removeItem('email');
      } else {
        newState = state
          .set('privKey', action.newAuthState.privKey)
          .set('email', action.newAuthState.email);
        storageService.setItem('privKey', action.newAuthState.privKey);
        storageService.setItem('email', action.newAuthState.email);
      }
      return newState
        .set('loggedIn', action.newAuthState.loggedIn);
    default:
      return state;
  }
}

export default accountProviderReducer;
