import { createFormAction } from '../../services/reduxFormSaga';
import {
  WORKER_ERROR,
  WALLET_EXPORTED,
} from './constants';

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

export const register = createFormAction('REGISTER');
