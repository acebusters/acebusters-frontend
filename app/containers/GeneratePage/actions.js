import { createFormAction } from '../../services/reduxFormSaga';
import {
  WORKER_ERROR,
  WORKER_PROGRESS,
  WALLET_EXPORTED,
  WALLET_EXPORT,
  ACCOUNT_TX_HASH_RECEIVED,
} from './constants';

export function workerError(error) {
  return {
    type: WORKER_ERROR,
    error,
  };
}

export function workerProgress(progress) {
  return {
    type: WORKER_PROGRESS,
    progress,
  };
}

export function walletExported(data) {
  return {
    type: WALLET_EXPORTED,
    data,
  };
}

export function walletExport(data) {
  return {
    type: WALLET_EXPORT,
    meta: {
      WebWorker: 'generate',
    },
    payload: {
      data,
    },
  };
}

export function accountTxHashReceived(txHash) {
  return { type: ACCOUNT_TX_HASH_RECEIVED, payload: txHash };
}

export const register = createFormAction('REGISTER');
