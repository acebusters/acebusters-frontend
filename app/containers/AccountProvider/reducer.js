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
  PROXY_EVENT,
  ETH_TRANSFER_SUCCESS,
  ETH_CLAIM,
} from './actions';
import { conf } from '../../app.config';
import * as storageService from '../../services/localStorage';

const confParams = conf();

const isLoggedIn = () => {
  const privKey = storageService.getItem('privKey');
  return (privKey !== undefined && privKey.length > 32);
};

// The initial application state
const initialState = fromJS({
  privKey: storageService.getItem('privKey'),
  email: storageService.getItem('email'),
  loggedIn: isLoggedIn(),
  blocky: null,
  nickName: null,
  signerAddr: null,
  web3ReadyState: READY_STATE.CONNECTING,
  web3ErrMsg: null,
  pending: {},
  pendingSell: [],
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

    case ETH_CLAIM:
      return state.withMutations((newState) => {
        const index = newState.get('pendingSell').indexOf(action.payload.sellTxHash);
        return newState.deleteIn(['pendingSell', index]);
      });

    case CONTRACT_TX_SUCCESS:
      return addPending(state, action)
              .withMutations((newState) => {
                const { payload: { address, txHash, methodName } } = action;
                if (address === confParams.ntzAddr && methodName === 'transfer') {
                  return newState.set(
                    'pendingSell',
                    newState.get('pendingSell').push(txHash)
                  );
                }
                return newState;
              });

    case ETH_TRANSFER_SUCCESS:
      return addPending(state, action);

    case CONTRACT_TX_ERROR:
      return state.setIn(['pending', action.payload.nonce, 'error'], action.payload.error);

    case PROXY_EVENT:
      return completePending(action.payload.event.transactionHash)(state);

    case CONTRACT_EVENT:
      return state
        .withMutations(completePending(action.event.transactionHash))
        .withMutations((newState) => {
          const tx = {
            blockNumber: action.event.blockNumber,
          };
          if (action.event.event === 'Transfer') {
            tx.from = action.event.args.from;
            tx.to = action.event.args.to;
            tx.value = action.event.args.value.toString();
          }

          return newState.setIn(
            [action.event.address, 'transactions', action.event.transactionHash],
            fromJS(tx)
          );
        });

    case SET_AUTH:
      // ToDo: extract side effects to sagas (storageService and Raven calls)
      return state
        .withMutations((newState) => {
          if (!action.newAuthState.loggedIn) {
            storageService.removeItem('privKey');
            storageService.removeItem('email');
            return newState
              .delete('privKey')
              .delete('email')
              .set('blocky', null)
              .set('nickName', null)
              .set('signerAddr', null);
          }

          Raven.setUserContext({
            email: action.newAuthState.email,
          });
          storageService.setItem('privKey', action.newAuthState.privKey);
          storageService.setItem('email', action.newAuthState.email);
          return newState
            .set('privKey', action.newAuthState.privKey)
            .set('email', action.newAuthState.email);
        })
        .set('loggedIn', action.newAuthState.loggedIn);

    default:
      return state;
  }
}

function addPending(state, action) {
  // the nonce is only increased after the call was successfull.
  // in the account saga we use a channel, so no 2 requests are submitted
  // at the same time and no nonce can be reused by accident.
  return state.set('lastNonce', action.payload.nonce)
              .setIn(['pending', action.payload.nonce, 'txHash'], action.payload.txHash);
}

function completePending(txHash) {
  return (state) => (
    state.get('pending').reduce((st, value, key) => {
      if (value.get('txHash') === txHash) {
        return st.deleteIn(['pending', key]);
      }

      return st;
    }, state)
  );
}

export default accountProviderReducer;
