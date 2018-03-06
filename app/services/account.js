import { conf } from '../app.config';
import { requestApi } from './api';

const request = requestApi(conf().accountUrl);

/* eslint-disable */
function uuid(a) {
  return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid); // eslint-disable-line import/extensions
};
/* eslint-enable */

export function unlock(unlockRequest) {
  return request('get', `unlock/${encodeURIComponent(unlockRequest)}`);
}

export function checkReferral(code) {
  return request('get', code ? `referral/${encodeURIComponent(code)}` : 'referral/');
}

export function resendEmail(email, origin) {
  return request('post', 'resend', { email, origin });
}

export function getAccount(accountId) {
  return request('get', `account/${accountId}`);
}

export function getRefs(accountId) {
  return request('get', `refs/${accountId}`);
}

export function confirm(sessionReceipt) {
  return request('post', 'confirm', { sessionReceipt });
}

export function addWallet(sessionReceipt, wallet, proxyAddr) {
  return request('post', 'wallet', {
    sessionReceipt,
    wallet: JSON.stringify(wallet),
    proxyAddr,
  });
}

export function resetWallet(sessionReceipt, wallet) {
  return request('put', 'wallet', {
    sessionReceipt,
    wallet: JSON.stringify(wallet),
  });
}

export function requestFunds(address) {
  return request('post', 'fund', { address });
}
