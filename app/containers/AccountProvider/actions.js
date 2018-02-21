export const SET_AUTH = 'acebusters/AccountProvider/SET_AUTH';
export const ACCOUNT_UNLOCKED = 'acebusters/AccountProvider/ACCOUNT_UNLOCKED';
export const INJECT_ACCOUNT_UPDATE = 'acebusters/AccountProvider/INJECT_ACCOUNT_UPDATE';
export const NETWORK_SUPPORT_UPDATE = 'acebusters/AccountProvider/NETWORK_SUPPORT_UPDATE';

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
export const CONTRACT_TX_SENDED = 'acebusters/AccountProvider/CONTRACT_TX_SENDED';
export const CONTRACT_TX_ERROR = 'acebusters/AccountProvider/CONTRACT_TX_ERROR';
export const CONTRACT_TX_NOT_EXISTS = 'acebusters/AccountProvider/CONTRACT_TX_NOT_EXISTS';
export const CONTRACT_TX_FAILED = 'acebusters/AccountProvider/CONTRACT_TX_FAILED';
export const CONTRACT_TX_MINED = 'acebusters/AccountProvider/CONTRACT_TX_MINED';
export const CONTRACT_TX_APPEARED = 'acebusters/AccountProvider/CONTRACT_TX_APPEARED';

export const CONTRACT_EVENTS = 'acebusters/AccountProvider/CONTRACT_EVENTS';

export const WALLET_LOADED = 'acebusters/App/WALLET_LOADED';
export const WALLET_IMPORTED = 'acebusters/App/WALLET_IMPORTED';

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
 * @param {Object} newAuthState New auth state
 * @param {boolean} loggedIn True means a user is logged in, false means no user is logged in
 * @param {string} privKey
 * @param {string} email
 */
export function setAuthState(newAuthState) {
  return { type: SET_AUTH, newAuthState };
}

export function accountUnlocked() {
  return { type: ACCOUNT_UNLOCKED };
}

export function updateInjectedAccount(account) {
  return { type: INJECT_ACCOUNT_UPDATE, payload: account };
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

export function contractTxSend(payload) {
  return { type: CONTRACT_TX_SEND, payload };
}

export function contractTxSended(payload) {
  return { type: CONTRACT_TX_SENDED, payload };
}

export function contractTxError(payload) {
  return { type: CONTRACT_TX_ERROR, payload };
}

export function contractTxNotExists(payload, txHash) {
  return { type: CONTRACT_TX_NOT_EXISTS, payload, meta: { txHash } };
}

export function contractTxFailed(payload, txHash) {
  return { type: CONTRACT_TX_FAILED, payload, meta: { txHash } };
}

export function contractTxMined(txHash) {
  return { type: CONTRACT_TX_MINED, meta: { txHash } };
}

export function contractTxAppeared(txHash) {
  return { type: CONTRACT_TX_APPEARED, meta: { txHash } };
}

export function contractEvent(event, userAddr) {
  return contractEvents([event], userAddr);
}

export function contractEvents(events, userAddr) {
  return { type: CONTRACT_EVENTS, payload: events, meta: { userAddr } };
}

export function walletLoaded(wallet) {
  return { type: WALLET_LOADED, payload: wallet };
}

export function walletImported(mnemonic) {
  return { type: WALLET_IMPORTED, payload: mnemonic };
}
