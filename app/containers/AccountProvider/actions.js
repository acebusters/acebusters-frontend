import { SET_AUTH,
  WEB3_CONNECT,
  WEB3_CONNECTED,
  WEB3_DISCONNECTED,
  SET_BALANCE,
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
