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
  CONTRACT_TX_SENDED,
  CONTRACT_EVENTS,
  ACCOUNT_LOADED,
  ACCOUNT_UNLOCKED,
  INJECT_ACCOUNT_UPDATE,
  NETWORK_SUPPORT_UPDATE,
  READY_STATE,
} from './actions';
import { ACCOUNT_TX_HASH_RECEIVED } from '../GeneratePage/constants';

// The initial application state
const initialState = fromJS({
  loggedIn: false,
  blocky: null,
  nickName: null,
  signerAddr: null,
  refs: null,
  web3ReadyState: READY_STATE.CONNECTING,
  onSupportedNetwork: false,
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

    case ACCOUNT_UNLOCKED:
      return (
        state
          .set('isLocked', false)
          .set('owner', state.get('injected'))
      );

    case INJECT_ACCOUNT_UPDATE:
      return state.set('injected', action.payload);

    case NETWORK_SUPPORT_UPDATE:
      return state.set('onSupportedNetwork', action.payload);

    case ACCOUNT_TX_HASH_RECEIVED:
      return state.set('proxyTxHash', action.payload);

    case ACCOUNT_LOADED:
      return (
        state
          .set('isLocked', action.payload.isLocked)
          .set('owner', action.payload.owner)
          .set('blocky', action.payload.blocky)
          .set('nickName', action.payload.nickName)
          .set('signerAddr', action.payload.signer)
          .set('refs', action.payload.refs)
      );

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

    case CONTRACT_TX_SENDED:
      return state;

    case CONTRACT_EVENTS:
      return action.payload.reduce(handleEvent, state);

    case SET_AUTH:
      return state
        .withMutations((newState) => {
          if (!action.newAuthState.loggedIn) {
            return newState
              .delete('privKey')
              .delete('email')
              .delete('accountId')
              .delete('proxy')
              .set('blocky', null)
              .set('nickName', null)
              .set('signerAddr', null)
              .set('refs', null);
          }

          return newState
            .set('privKey', action.newAuthState.privKey)
            .set('accountId', action.newAuthState.accountId)
            .set('proxy', action.newAuthState.proxyAddr)
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
