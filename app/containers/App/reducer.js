import { fromJS } from 'immutable';

import {
  MODAL_ADD,
  MODAL_DISMISS,
  GLOBAL_PROGRESS,
} from './actions';

// The initial state of the App
const initialState = fromJS({
  modalStack: [],
  progress: 0,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_ADD: {
      let newStack = state.get('modalStack');
      newStack = newStack.push(action.node);
      return state
        .set('modalStack', newStack);
    }
    case MODAL_DISMISS: {
      let newStack = state.get('modalStack');
      newStack = newStack.pop();
      return state
        .set('modalStack', newStack);
    }
    case GLOBAL_PROGRESS: {
      return state.set('progress', action.data);
    }
    default:
      return state;
  }
}

export default appReducer;
