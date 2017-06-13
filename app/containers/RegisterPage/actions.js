import {
  REGISTER,
} from './constants';

export function register(data) {
  return {
    type: REGISTER,
    payload: data,
  };
}
