import ethers from 'ethers';

import {
  WORKER_ERROR,
  WORKER_PROGRESS,
  WALLET_EXPORTED,
  WALLET_EXPORT,
} from './constants';

self.onmessage = ({ data: action }) => {
  if (action.type === WALLET_EXPORT) {
    exportWallet(action.payload);
  }
};

function exportWallet(payload) {
  const data = payload.data;
  const wallet = ethers.Wallet.createRandom({ extraEntropy: data.entropy });

  let last = 0;
  const progress = (pc) => {
    const percent = Math.floor(pc * 100);
    // too many numbers, react does not have time to redraw progress.
    if (
      percent === last ||
      percent === last + 1 ||
      percent === last + 2
    ) {
      return;
    }
    last = percent;
    postMessage({
      type: WORKER_PROGRESS,
      payload: { progress: last },
    });
  };

  wallet.encrypt(data.password, progress)
    .then((json) => {
      postMessage({
        type: WORKER_PROGRESS,
        payload: { progress: 100 },
      });

      postMessage({
        type: WALLET_EXPORTED,
        payload: {
          json,
          privateKey: wallet.privateKey,
        },
      });
    })
    .catch((reason) => {
      console.dir(reason);
      progress(0);
      postMessage({
        type: WORKER_ERROR,
        payload: { error: reason.message },
      });
    });
}
