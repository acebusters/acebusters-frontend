import { fromJS } from 'immutable';
import Raven from 'raven-js';
import {
  SET_AUTH,
  WEB3_ERROR,
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
  ACCOUNT_LOADED,
  READY_STATE,
} from './actions';
import * as storageService from '../../services/localStorage';

const isLoggedIn = () => {
  const privKey = storageService.getItem('privKey');
  return (privKey !== undefined && privKey.length > 32);
};

// The initial application state
const initialState = fromJS({
  privKey: storageService.getItem('privKey'),
  email: storageService.getItem('email'),
  loggedIn: isLoggedIn(),
  web3ReadyState: READY_STATE.CONNECTING,
  web3ErrMsg: null,
});

function accountProviderReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case WEB3_CONNECTED:
      return state.set('web3ReadyState', READY_STATE.OPEN);
    case WEB3_DISCONNECTED:
      return state.set('web3ReadyState', READY_STATE.CLOSED);
    case WEB3_ERROR:
      return state.set('web3ErrMsg', action.err ? (action.err.message || 'Connection Error') : null);
    case ACCOUNT_LOADED:
      return state.set('proxy', action.data.proxy).set('controller', action.data.controller).set('lastNonce', action.data.lastNonce);
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
      return state.setIn([action.payload.dest, 'pending', action.payload.nonce, 'call'], action.payload.key);

    case CONTRACT_TX_SUCCESS:
      // the nonce is only increased after the call was successfull.
      // in the account saga we use a channel, so no 2 requests are submitted
      // at the same time and no nonce can be reused by accident.
      return state.set('lastNonce', action.nonce)
        .setIn([action.address, 'pending', action.nonce, 'txHash'], action.txHash);
    case CONTRACT_TX_ERROR:
      return state.setIn([action.address, 'pending', action.nonce, 'error'], action.error);
    case CONTRACT_EVENT:
      if (newState.getIn([action.event.address, 'pending'])) {
        newState.getIn([action.event.address, 'pending']).forEach((value, key) => {
          if (value.get('txHash') === action.event.transactionHash) {
            newState = newState.deleteIn([action.event.address, 'pending', key]);
          }
        });
      }
      newState = newState.setIn([action.event.address, 'transactions', action.event.transactionHash, 'blockNumber'], action.event.blockNumber);
      if (action.event.event === 'Transfer') {
        newState = newState.setIn([action.event.address, 'transactions', action.event.transactionHash, 'from'], action.event.args.from);
        newState = newState.setIn([action.event.address, 'transactions', action.event.transactionHash, 'to'], action.event.args.to);
        newState = newState.setIn([action.event.address, 'transactions', action.event.transactionHash, 'value'], action.event.args.value.toString());
      }
      return newState;
    case SET_AUTH:
      if (!action.newAuthState.loggedIn) {
        newState = state
          .delete('privKey')
          .delete('email');
        storageService.removeItem('privKey');
        storageService.removeItem('email');
      } else {
        Raven.setUserContext({
          email: action.newAuthState.email,
        });
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
