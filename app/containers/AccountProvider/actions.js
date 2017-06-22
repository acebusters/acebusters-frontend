export const SET_AUTH = 'acebusters/AccountProvider/SET_AUTH';
export const ACCOUNT_LOADED = 'acebusters/AccountProvider/ACCOUNT_LOADED';

export const WEB3_ERROR = 'acebusters/AccountProvider/WEB3_ERROR';
export const WEB3_CONNECT = 'acebusters/AccountProvider/WEB3_CONNECT';
export const WEB3_CONNECTED = 'acebusters/AccountProvider/WEB3_CONNECTED';
export const WEB3_DISCONNECTED = 'acebusters/AccountProvider/WEB3_DISCONNECTED';

export const WEB3_METHOD_CALL = 'acebusters/AccountProvider/WEB3_METHOD_CALL';
export const WEB3_METHOD_SUCCESS = 'acebusters/AccountProvider/WEB3_METHOD_SUCCESS';
export const WEB3_METHOD_ERROR = 'acebusters/AccountProvider/WEB3_METHOD_ERROR';

export const CONTRACT_METHOD_CALL = 'acebusters/AccountProvider/CONTRACT_METHOD_CALL';
export const CONTRACT_METHOD_SUCCESS = 'acebusters/AccountProvider/CONTRACT_METHOD_SUCCESS';
export const CONTRACT_METHOD_ERROR = 'acebusters/AccountProvider/CONTRACT_METHOD_ERROR';

export const CONTRACT_TX_SEND = 'acebusters/AccountProvider/CONTRACT_TX_SEND';
export const CONTRACT_TX_SUCCESS = 'acebusters/AccountProvider/CONTRACT_TX_SUCCESS';
export const CONTRACT_TX_ERROR = 'acebusters/AccountProvider/CONTRACT_TX_ERROR';

export const ETH_CLAIM = 'acebusters/AccountProvider/ETH_CLAIM';

export const ETH_TRANSFER = 'acebusters/AccountProvider/ETH_TRANSFER';
export const ETH_TRANSFER_SUCCESS = 'acebusters/AccountProvider/ETH_TRANSFER_SUCCESS';
export const ETH_TRANSFER_ERROR = 'acebusters/AccountProvider/ETH_TRANSFER_ERROR';

export const PROXY_EVENT = 'acebusters/AccountProvider/PROXY_EVENT';

export const CONTRACT_EVENT = 'acebusters/AccountProvider/CONTRACT_EVENT';
export const BLOCK_NOTIFY = 'acebusters/AccountProvider/BLOCK_NOTIFY';

// Note: refer to  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
export const READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const SUPPORTED_WEB3_METHODS = {
  net: {
    getListening: {},
    getPeerCount: {},
  },
  version: {
    getNode: {},
    getNetwork: {},
    getEthereum: {},
    getWhisper: {},
  },
  eth: {
    getBalance: {},
    getCode: {},
    getTransactionCount: {},
    getStorageAt: {},
    getSyncing: {},
    getCoinbase: {},
    getMining: {},
    getHashrate: {},
    getGasPrice: {},
    getAccounts: {},
    getBlockNumber: {},
    getBlock: {},
    getBlockTransactionCount: {},
    getUncle: {},
    // getTransactionFromBlock: {},
    // getTransaction: { actionCreator: getTransaction },
    // getTransactionReceipt: { actionCreator: getTransaction },
    // sendTransaction: { actionCreator: createTransaction },
    // sendRawTransaction: { actionCreator: createTransaction },
  },
};

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newAuthState) {
  return { type: SET_AUTH, newAuthState };
}

export function accountLoaded(data) {
  return { type: ACCOUNT_LOADED, data };
}

export function blockNotify() {
  return { type: BLOCK_NOTIFY };
}

export function web3Error(err) {
  return { type: WEB3_ERROR, err };
}

export function clearWeb3Error() {
  return { type: WEB3_ERROR, err: null };
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

export function claimETH(payload) {
  return { type: ETH_CLAIM, payload };
}

export function transferETH(payload) {
  return { type: ETH_TRANSFER, payload };
}

export function transferETHSuccess(payload) {
  return { type: ETH_TRANSFER_SUCCESS, payload };
}

export function transferETHError(payload) {
  return { type: ETH_TRANSFER_ERROR, payload };
}

export function proxyEvent(event) {
  return {
    type: PROXY_EVENT,
    payload: { event },
  };
}

export function contractTxSend(payload) {
  return { type: CONTRACT_TX_SEND, payload };
}

export function contractTxSuccess(payload) {
  return { type: CONTRACT_TX_SUCCESS, payload };
}

export function contractTxError({ address, nonce, error }) {
  return { type: CONTRACT_TX_ERROR, payload: { address, nonce, error } };
}

export function contractEvent({ event }) {
  return { type: CONTRACT_EVENT, event };
}
