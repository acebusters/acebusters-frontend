import Immutable, { fromJS } from 'immutable';

import {
  SET_AUTH,
  SET_BALANCE,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED,
  WEB3_METHOD_SUCCESS,
  WEB3_METHOD_ERROR,
  CONTRACT_METHOD_SUCCESS,
  CONTRACT_METHOD_ERROR,
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
  web3: {
    methods: {},
    transactions: {},
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
        return state.setIn([action.address, action.key], fromJS(action.payload));
      }
      return state.set(action.address, Immutable.Map(action.key, action.payload));
    case CONTRACT_METHOD_ERROR:
      return state;
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
