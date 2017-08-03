import { fromJS } from 'immutable';

import {
  MODAL_ADD,
  MODAL_DISMISS,
  GLOBAL_PROGRESS,
} from './actions';

// The initial state of the App
const initialState = fromJS({
  modalStack: [],
  modalCloseHandlers: [],
  progress: 0,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_ADD:
      return state
        .set('modalStack', state.get('modalStack').push(action.payload.node))
        .set('modalCloseHandlers', state.get('modalCloseHandlers').push(action.payload.closeHandler));

    case MODAL_DISMISS:
      return state
        .set('modalStack', state.get('modalStack').pop())
        .set('modalCloseHandlers', state.get('modalCloseHandlers').pop());

    case GLOBAL_PROGRESS:
      return state.set('progress', action.data);

    default:
      return state;
  }
}

export default appReducer;
