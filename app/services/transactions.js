import { conf } from '../app.config';
import { requestApi } from './api';

const request = requestApi(conf().txUrl);

export function sendTx(forwardReceipt, resetConfReceipt) {
  return request('post', 'forward', { forwardReceipt, resetConfReceipt });
}
