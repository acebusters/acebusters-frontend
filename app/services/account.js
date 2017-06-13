import fetch from 'isomorphic-fetch';
import { conf } from '../app.config';

/* eslint-disable */
function uuid(a) {
  return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid); // eslint-disable-line import/extensions
};
/* eslint-enable */


function request(path, body, method = 'post') {
  return new Promise((resolve, reject) => {
    fetch(`${conf().accountUrl}/${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    }).then((rsp) => {
      if (rsp.status >= 200 && rsp.status < 300) {
        rsp.json().then((response) => {
          resolve(response);
        });
      } else {
        reject(rsp.status);
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

const account = {

  login(email) {
    return request('query', { email });
  },

  checkReferral(code) {
    return request(
      code ? `referral/${code}` : 'referral/',
      undefined,
      'get'
    );
  },

  register(email, recapResponse, origin, refCode) {
    const accountId = uuid();
    return request(`account/${accountId}`, {
      email,
      recapResponse,
      origin,
      refCode,
    });
  },

  confirm(sessionReceipt) {
    return request('confirm', { sessionReceipt });
  },

  addWallet(sessionReceipt, wallet) {
    return request('wallet', {
      sessionReceipt,
      wallet: JSON.stringify(wallet),
    });
  },

  reset(email, recapResponse, origin) {
    return request('reset', {
      email,
      recapResponse,
      origin,
    });
  },

  resetWallet(sessionReceipt, wallet) {
    return request('wallet', {
      sessionReceipt,
      wallet: JSON.stringify(wallet),
    }, 'put');
  },
};

export default account;
