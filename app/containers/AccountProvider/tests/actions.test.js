
import {
  loginRequest,
} from '../actions';
import {
  LOGIN_REQUEST,
} from '../constants';

describe('LoginPage actions', () => {
  describe('Default Action', () => {
    it('has a type of LOGIN_REQUEST', () => {
      const expected = {
        type: LOGIN_REQUEST,
        email: 'email',
      };
      expect(loginRequest({ email: 'email' })).toEqual(expected);
    });
  });
});
