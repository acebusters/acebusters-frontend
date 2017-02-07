/**
 * Created by helge on 07.10.16.
 */

import Immutable from 'seamless-immutable`'; // eslint-disable-line
import * as AccountActions from '../Account/actions';

const defaultState = Immutable({});

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case AccountActions.LOGIN_SUCCESS:
      return state.set('privKey', action.privKey);
    default:
      return state;
  }
}

