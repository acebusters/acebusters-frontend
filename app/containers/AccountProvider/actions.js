import { SET_AUTH,
  WEB3_CONNECT,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED,
  SET_BALANCE,
  WEB3_METHOD_CALL,
  WEB3_METHOD_SUCCESS,
  WEB3_METHOD_ERROR,
  CONTRACT_METHOD_CALL,
  CONTRACT_METHOD_SUCCESS,
  CONTRACT_METHOD_ERROR,
} from './constants';

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newAuthState) {
  return { type: SET_AUTH, newAuthState };
}

export function setBalance(newBal) {
  return { type: SET_BALANCE, newBal };
}

export function web3Connect() {
  return { type: WEB3_CONNECT };
}

export function web3Connected({ web3, isConnected }) {
  return {
    type: WEB3_CONNECTED,
    payload: {
      web3,
      isConnected,
    },
  };
}

export function web3Disconnected() {
  return {
    type: WEB3_DISCONNECTED,
    payload: {
      web3: null,
      isConnected: false,
    },
  };
}

export function web3MethodCall(payload) {
  return { type: WEB3_METHOD_CALL, payload };
}

export function web3MethodSuccess({ key, payload }) {
  return { type: WEB3_METHOD_SUCCESS, key, payload };
}

export function web3MethodError({ key, payload }) {
  return { type: WEB3_METHOD_ERROR, key, payload };
}

export function contractMethodCall(payload) {
  return { type: CONTRACT_METHOD_CALL, payload };
}

export function contractMethodSuccess({ address, key, payload }) {
  return { type: CONTRACT_METHOD_SUCCESS, address, key, payload };
}

export function contractMethodError({ address, key, payload }) {
  return { type: CONTRACT_METHOD_ERROR, address, key, payload };
}

export function contractTransactionCreate(payload) {
  return { type: CONTRACT_METHOD_CALL, payload };
}
