/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';
import { ETH_BALANCE_UPDATE } from './constants';

const initialState = fromJS({
  ethBalance: undefined,
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case ETH_BALANCE_UPDATE:
      return state.set('ethBalance', action.payload);
    default:
      return state;
  }
}

export default dashboardReducer;
