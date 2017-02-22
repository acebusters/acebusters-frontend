export const SET_AUTH = 'acebusters/AccountProvider/SET_AUTH';
export const SET_BALANCE = 'acebusters/AccountProvider/SET_BALANCE';

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
