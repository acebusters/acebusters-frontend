import { fromJS } from 'immutable';
import {
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR,
  EXPORT_REQUEST,
  IMPORT_REQUEST,
  WORKER_ERROR,
  WORKER_PROGRESS,
  WALLET_EXPORTED,
  WALLET_IMPORTED,
} from './constants';

import auth from '../../utils/auth';

// The initial application state
const initialState = fromJS({
  accountState: {
    username: '',
    password: '',
  },
  error: '',
  currentlySending: false,
  loggedIn: auth.loggedIn(),
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
    case IMPORT_REQUEST:
    case EXPORT_REQUEST:
      return state.set('workerProgress', 0);
    case WORKER_ERROR:
      return state
        .set('workerProgress', -1)
        .set('error', action.event);
    case WORKER_PROGRESS:
      return state
        .set('workerProgress', action.percent);
    case WALLET_EXPORTED:
      return state
        .delete('workerProgress')
        .set('wallet', action.json);
    case WALLET_IMPORTED:
      return state
        .delete('workerProgress')
        .set('privKey', action.privKey);
    default:
      return state;
  }
}

export default accountProviderReducer;
