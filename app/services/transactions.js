import { conf } from '../app.config';

const confParams = conf();

export function sendTx(forwardReceipt, resetConfReceipt) {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.txUrl}/forward`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ forwardReceipt, resetConfReceipt }),
    }).then((rsp) => {
      rsp.json().then((response) => {
        if (rsp.status >= 200 && rsp.status < 300) {
          resolve(response);
        } else {
          reject({
            status: rsp.status,
            message: response,
          });
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });
}
