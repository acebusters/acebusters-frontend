import { conf } from '../app.config';
import { requestApi } from './api';

const request = requestApi(conf().accountUrl);

/* eslint-disable */
function uuid(a) {
  return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid); // eslint-disable-line import/extensions
};
/* eslint-enable */

export function login(email) {
  return request('post', 'query', { email });
}

export function unlock(unlockRequest) {
  return request('get', `unlock/${encodeURIComponent(unlockRequest)}`);
}

export function checkReferral(code) {
  return request('get', code ? `referral/${encodeURIComponent(code)}` : 'referral/');
}

export function register(email, recapResponse, origin, refCode) {
  const accountId = uuid();
  return request('post', `account/${accountId}`, {
    email,
    recapResponse,
    origin,
    refCode,
  });
}

export function resendEmail(sessionReceipt, origin) {
  return request('post', 'resend', { sessionReceipt, origin });
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

export function reset(email, recapResponse, origin) {
  return request('post', 'reset', {
    email,
    recapResponse,
    origin,
  });
}

export function resetWallet(sessionReceipt, wallet) {
  return request('put', 'wallet', {
    sessionReceipt,
    wallet: JSON.stringify(wallet),
  });
}
