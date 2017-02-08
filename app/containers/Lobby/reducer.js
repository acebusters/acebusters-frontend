/**
 * Created by helge on 20.09.16.
 */

import { fromJS } from 'immutable';
import * as LobbyActions from './actions';

const initialState = fromJS({
  balance: null,
  tables: [],
});

export default function lobbyReducer(state = initialState, action) {
  let update = {};
  switch (action.type) {
    case LobbyActions.BALANCE_UPDATED:
      update = {};
      update.balance = action.balance;

      return Object.assign({}, state, update);
    case LobbyActions.TABLES_UPDATED:
      update = {};
      update.tables = action.tables;

      return Object.assign({}, state, update);
    default:
      return state;
  }
}
