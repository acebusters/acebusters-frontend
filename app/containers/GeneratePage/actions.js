import { createFormAction } from '../../services/reduxFormSaga';

export const WORKER_ERROR = 'acebusters/RegisterPage/WORKER_ERROR';
export const WALLET_EXPORTED = 'acebusters/RegisterPage/WALLET_EXPORTED';
export const ACCOUNT_TX_HASH_RECEIVED = 'acebusters/RegisterPage/ACCOUNT_TX_HASH_RECEIVED';

export function workerError(error) {
  return {
    type: WORKER_ERROR,
    error,
  };
}

export function walletExported(data) {
  return {
    type: WALLET_EXPORTED,
    data,
  };
}

export function accountTxHashReceived(txHash) {
  return { type: ACCOUNT_TX_HASH_RECEIVED, payload: txHash };
}

export const register = createFormAction('REGISTER');
