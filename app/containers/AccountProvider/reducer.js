/*
 *
 * AccountProvider reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR
} from './constants';

import auth from '../../utils/auth'

// The initial application state
const initialState = fromJS({
  accountState: {
    username: '',
    password: ''
  },
  error: '',
  currentlySending: false,
  loggedIn: auth.loggedIn()
});

function accountProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return state
        .set('accountState', action.newFormState);
    case SET_AUTH:
      return state
        .set('loggedIn', action.newAuthState);
    case SENDING_REQUEST:
      return state
        .set('currentlySending', action.sending);
    case REQUEST_ERROR:
      return state
        .set('error', action.error);
    case CLEAR_ERROR:
      return state.delete('error');
    default:
      return state
  }
}

export default accountProviderReducer;
