import { List, Map } from 'immutable';
import * as types from './actions';

export const initialState = List([]);

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {

    case types.NOTIFY_ADD: {
      const notification = Map(action.notification);
      const newState = state.push(notification);
      return newState;
    }

    case types.NOTIFY_DELETE: {
      const newState = state
        .filter((note) => note.get('txId') !== action.txId);
      return newState;
    }

    case types.NOTIFY_REMOVING: {
      const newState = state
        .map((note) => {
          if (note.get('txId') === action.txId) {
            return note.set('removing', true);
          }
          return note;
        });
      return newState;
    }

    default: {
      return state;
    }
  }
}
