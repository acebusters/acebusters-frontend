/**
 * Created by helge on 20.09.16.
 */

import * as LobbyActions from './actions';

const defaultState = {
  balance: 0,
  tables: [],
};

export default function lobby(state = defaultState, action) {
  let update = {};
  switch (action.type) {
    case LobbyActions.GET_BALANCE:
      update = {};
      if (!action.error) { update.balance = action.payload.balance; } else {
        update.error = action.error;
      }

      return Object.assign({}, state, update);
    case LobbyActions.GET_TABLES:
      update = {};
      if (!action.error) {
        update.tables = action.payload.tables;
      } else {
        update.error = action.error;
      }

      return Object.assign({}, state, update);
    case LobbyActions.JOIN_TABLE:
      update = {};
      if (action.error) {
        update.tableId = action.tableId;
      } else {
        update.error = action.error;
      }

      return Object.assign({}, state, update);
    default:
      return state;
  }
}
