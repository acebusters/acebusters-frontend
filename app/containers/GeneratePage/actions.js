import { createFormAction } from '../../services/reduxFormSaga';

export const WORKER_ERROR = 'acebusters/RegisterPage/WORKER_ERROR';
export const WALLET_EXPORTED = 'acebusters/RegisterPage/WALLET_EXPORTED';

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
