import { fromJS } from 'immutable';

import { SET_AUTH } from './constants';
import * as storageService from '../../services/localStorage';

const isLoggedIn = () => {
  const privKey = storageService.getItem('privKey');
  return (privKey !== undefined && privKey.length > 32);
};

// The initial application state
const initialState = fromJS({
  privKey: storageService.getItem('privKey'),
  loggedIn: isLoggedIn(),
});

function accountProviderReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case SET_AUTH:
      if (!action.newAuthState.loggedIn) {
        newState = state.delete('privKey');
        storageService.removeItem('privKey');
      } else {
        newState = state.set('privKey', action.newAuthState.privKey);
        storageService.setItem('privKey', action.newAuthState.privKey);
      }
      return newState
        .set('loggedIn', action.newAuthState.loggedIn);
    default:
      return state;
  }
}

export default accountProviderReducer;
