/**
 * Created by jzobro on 20170606
 */
import { fromJS } from 'immutable';
import * as types from './actions';

export const initialState = fromJS({
  open: false,
  active: false,
});

export default function tableMenuReducer(state = initialState, action) {
  switch (action.type) {

    case types.MENU_TOGGLE_OPEN: {
      return state.set('open', !state.get('open'));
    }

    case types.MENU_TOGGLE_ACTIVE: {
      return state.set('active', !state.get('active'));
    }

    default: {
      return state;
    }
  }
}
