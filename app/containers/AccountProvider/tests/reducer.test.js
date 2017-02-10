
import { fromJS } from 'immutable';
import loginPageReducer from '../reducer';

describe('AccountProviderReducer', () => {
  it('returns the initial state', () => {
    expect(loginPageReducer(undefined, {})).toEqual(fromJS({
      formState: {
        username: '',
        password: '',
      },
      error: '',
      recapResponse: '',
      currentlySending: false,
      privKey: undefined,
      loggedIn: false,
    }));
  });
});
