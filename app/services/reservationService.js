import { conf } from '../app.config';
import { requestApi } from './api';

const request = requestApi(conf().reservationUrl);

export function reserve(tableAddr, pos, signerAddr, txHash, amount) {
  return request('post', `reserve/table/${tableAddr}/${pos}`, {
    signerAddr,
    txHash,
    amount,
  });
}

export function lineup(tableAddr) {
  return request('get', `lineup/${tableAddr}`);
}
