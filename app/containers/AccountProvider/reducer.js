import { fromJS } from 'immutable';
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
  ETH_TRANSFER_SUCCESS,
  CONTRACT_EVENTS,
  ACCOUNT_LOADED,
  READY_STATE,
} from './actions';

// The initial application state
const initialState = fromJS({
  loggedIn: false,
  blocky: null,
  nickName: null,
  signerAddr: null,
  web3ReadyState: READY_STATE.CONNECTING,
  web3ErrMsg: null,
});

function accountProviderReducer(state = initialState, action) {
  switch (action.type) {
    case WEB3_CONNECTED:
      return state.set('web3ReadyState', READY_STATE.OPEN);

    case WEB3_DISCONNECTED:
      return state.set('web3ReadyState', READY_STATE.CLOSED);

    case WEB3_ERROR:
      return state.set('web3ErrMsg', action.err ? (action.err.message || 'Connection Error') : null);

    case ACCOUNT_LOADED:
      return state.set('proxy', action.data.proxy)
        .set('controller', action.data.controller)
        .set('lastNonce', action.data.lastNonce)
        .set('blocky', action.data.blocky)
        .set('nickName', action.data.nickName)
        .set('signerAddr', action.data.signer);

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
      // Note: CONTRACT_TX_SEND is useless at this moment, but still keep it for consistency with the relevant actions.
      return state;

    case CONTRACT_TX_SUCCESS:
    case ETH_TRANSFER_SUCCESS:
      return state.set('lastNonce', action.payload.nonce);

    case CONTRACT_EVENTS:
      return action.payload.reduce(handleEvent, state);

    case SET_AUTH:
      return state
        .withMutations((newState) => {
          if (!action.newAuthState.loggedIn) {
            return newState
              .delete('privKey')
              .delete('email')
              .set('blocky', null)
              .set('nickName', null)
              .set('signerAddr', null);
          }

          return newState
            .set('privKey', action.newAuthState.privKey)
            .set('email', action.newAuthState.email);
        })
        .set('loggedIn', action.newAuthState.loggedIn);

    default:
      return state;
  }
}

function addTx(event) {
  return (state) => {
    const tx = {
      blockNumber: event.blockNumber,
    };
    if (event.event === 'Transfer') {
      tx.from = event.args.from;
      tx.to = event.args.to;
      tx.value = event.args.value.toString();
    }

    return state.setIn(
      [event.address, 'transactions', event.transactionHash],
      fromJS(tx)
    );
  };
}

function handleEvent(state, event) {
  return addTx(event)(state);
}

export default accountProviderReducer;
