import { fromJS } from 'immutable';
import {
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR,
  EXPORT_REQUEST,
  WORKER_ERROR,
  WORKER_PROGRESS,
  WORKER_EXPORTED,
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
    case EXPORT_REQUEST:
      return state.set('exportProgress', 0);
    case WORKER_ERROR:
      return state
        .set('exportProgress', -1)
        .set('error', action.event);
    case WORKER_PROGRESS:
      return state
        .set('exportProgress', action.percent);
    case WORKER_EXPORTED:
      return state
        .delete('exportProgress')
        .set('json', action.json);
    default:
      return state;
  }
}

export default accountProviderReducer;
