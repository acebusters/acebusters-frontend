/**
 * Created by helge on 06.10.16.
 */

export const GENERATED_SUCCESS = 'GENERATED_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_REQUESTED = 'LOGIN_FAILED';

export function generateSuccess(hexSeed, address) {
  return { type: GENERATED_SUCCESS, hexSeed, address };
}

export function requestLogin(creds) {
  return { type: LOGIN_REQUESTED, creds };
}

export function loginSuccess(privKey) {
  return { type: LOGIN_SUCCESS, privKey };
}

export function loginFailed(msg) {
  return { type: LOGIN_FAILED, msg };
}

