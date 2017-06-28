import { fromJS } from 'immutable';
import * as types from './actions';

export const initialState = fromJS({
  collapsed: true,
});

export default function headerReducer(state = initialState, action) {
  switch (action.type) {

    case types.SET_COLLAPSED: {
      return state.set('collapsed', action.collapsed);
    }

    default: {
      return state;
    }
  }
}
