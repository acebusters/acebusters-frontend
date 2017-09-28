import { List, Map } from 'immutable';
import * as types from './actions';
import { SET_AUTH } from '../AccountProvider/actions';

export const initialState = List([]);

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.NOTIFY_ADD:
      return state
              .filter((note) => note.get('txId') !== action.notification.txId) // prevent duplicates
              .push(Map(action.notification));

    case types.NOTIFY_DELETE:
      return state.filter((note) => note.get('txId') !== action.txId);

    case types.NOTIFY_REMOVING:
      return state.map(
        (note) => note.set('removing', note.get('txId') === action.txId)
      );

    case SET_AUTH:
      return !action.newAuthState.loggedIn ? state.clear() : state;

    default:
      return state;
  }
}
