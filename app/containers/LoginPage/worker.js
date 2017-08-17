import ethers from 'ethers';

import {
  WORKER_ERROR,
  WORKER_PROGRESS,
  WALLET_IMPORTED,
  WALLET_IMPORT,
} from './constants';

self.onmessage = ({ data: action }) => {
  if (action.type === WALLET_IMPORT) {
    importWallet(action.payload);
  }
};

function importWallet(payload) {
  const data = payload.data;
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

  ethers.Wallet.fromEncryptedWallet(data.json, data.password, progress)
    .then((wallet) => {
      postMessage({
        type: WORKER_PROGRESS,
        payload: { progress: 100 },
      });

      postMessage({
        type: WALLET_IMPORTED,
        payload: { hexSeed: wallet.privateKey.replace('0x', '') },
      });
    })
    .catch((reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.dir(reason);
      }
      progress(0);
      postMessage({
        type: WORKER_ERROR,
        payload: { error: reason.message },
      });
    });
}
