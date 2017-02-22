import { fromJS } from 'immutable';
import accountProviderReducer from '../reducer';

describe('account reducer tests', () => {
  it('should return the default state.', () => {
    expect(accountProviderReducer(undefined, {}).toJS()).toEqual({
      privKey: undefined,
      email: undefined,
      lastNonce: 0,
      loggedIn: false,
    });
  });

});




