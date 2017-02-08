import fetch from 'isomorphic-fetch';
import uuid from 'node-uuid';

const accountUrl = 'https://hsqkzjp3m8.execute-api.eu-west-1.amazonaws.com/v0';

const accountService = {

  login(email) {
    return new Promise((resolve, reject) => {
      fetch(accountUrl + '/query/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
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
  },

  register(email, wallet, recapResponse) {
    const accountId = uuid.v4();
    return new Promise((resolve, reject) => {
      fetch(accountUrl + '/account/'+accountId, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          recapResponse: recapResponse,
          wallet: JSON.stringify(wallet),
        }),
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.status);
        } else {
          reject(response.status);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },

  confirm(token) {
    return new Promise((resolve, reject) => {
      fetch(accountUrl + '/confirm', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        }),
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          resolve(response.status);
        } else {
          reject(response.status);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
};

export default accountService;
