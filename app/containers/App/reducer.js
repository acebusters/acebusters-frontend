import { fromJS } from 'immutable';

import {
  TRANSFER_TOGGLE,
  SIDEBAR_TOGGLE,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  sidebarCollapse: true,
  transferShow: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case TRANSFER_TOGGLE:
      return state
        .set('transferShow', !state.get('transferShow'));
    case SIDEBAR_TOGGLE:
      return state
        .set('sidebarCollapse', !state.get('sidebarCollapse'));
    default:
      return state;
  }
}

export default appReducer;
