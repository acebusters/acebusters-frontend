/**
 * Created by helge on 20.09.16.
 */

import * as LobbyActions from './actions';

const defaultState = {};

export default function lobbyReducer(state = defaultState, action) {
  let update = {};
  switch (action.type) {
    case LobbyActions.BALANCE_UPDATED:
      update = {};
      update.balance = action.balance;

      return Object.assign({}, state, update);
    case LobbyActions.TABLES_UPDATED:
      update = {};
      update.tables = action.payload.tables;

      return Object.assign({}, state, update);
    default:
      return state;
  }
}
