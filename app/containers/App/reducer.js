import { fromJS } from 'immutable';

import {
  MODAL_ADD,
  MODAL_DISMISS,
  GLOBAL_PROGRESS,
} from './actions';

// The initial state of the App
const initialState = fromJS({
  modalStack: [],
  wallet: null,
  progress: 0,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_ADD:
      return state
        .set('modalStack', state.get('modalStack').push({
          modalType: action.payload.modalType,
          modalProps: {
            ...action.payload.modalProps,
            closeHandler: action.payload.closeHandler,
            backdrop: action.payload.backdrop,
          },
        }));

    case MODAL_DISMISS:
      return state
        .set('modalStack', state.get('modalStack').pop());

    case GLOBAL_PROGRESS:
      return state.set('progress', action.data);

    default:
      return state;
  }
}

export default appReducer;
