/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';

const initialState = fromJS({});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default dashboardReducer;
