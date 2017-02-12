import { SET_AUTH } from './constants';

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newAuthState) {
  return { type: SET_AUTH, newAuthState };
}
