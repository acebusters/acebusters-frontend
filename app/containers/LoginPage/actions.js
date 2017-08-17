import { createFormAction } from '../../services/reduxFormSaga';
import {
  WORKER_ERROR,
  WORKER_PROGRESS,
  WALLET_IMPORTED,
  WALLET_IMPORT,
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

export function walletImported(data) {
  return {
    type: WALLET_IMPORTED,
    data,
  };
}

export function walletImport(data) {
  return {
    type: WALLET_IMPORT,
    meta: {
      WebWorker: 'login',
    },
    payload: {
      data,
    },
  };
}

export const login = createFormAction('LOGIN');
