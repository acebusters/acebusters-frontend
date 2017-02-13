import { createFormAction } from '../../services/reduxFormSaga';
import {
  WORKER_ERROR,
  WALLET_IMPORTED,
} from './constants';

export function workerError(error) {
  return {
    type: WORKER_ERROR,
    error,
  };
}

export function walletImported(data) {
  return {
    type: WALLET_IMPORTED,
    data,
  };
}

export const login = createFormAction('LOGIN');
