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
  CONTRACT_EVENT,
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
  lastNonce: 0,
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
    case CONTRACT_EVENT:
      newState.getIn([action.event.address, 'pending']).forEach((value, key) => {
        if (value.get('txHash') === action.event.transactionHash) {
          newState = newState.deleteIn([action.event.address, 'pending', key]);
        }
      });
      newState = newState.setIn([action.event.address, 'transactions', action.event.transactionHash, 'blockNumber'], action.event.blockNumber);
      return newState;
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
