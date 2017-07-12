export function waitForTx(web3, txHash) {
  return new Promise((resolve, reject) => {
    const filter = web3.eth.filter('latest');
    web3.eth.getTransaction(txHash, (txError, transaction) => {
      if (txError) {
        reject(txError);
      } else {
        filter.watch((err, blockHash) => {
          if (err) {
            reject(err);
            filter.stopWatching(() => null);
          }

          web3.eth.getBlock(blockHash, true, (blockErr, block) => {
            if (!blockErr) {
              const hasTx = block.transactions.some((tx) => tx.hash === txHash);

              if (hasTx) {
                web3.eth.getTransactionReceipt(txHash, (receipErr, receipt) => {
                  if (receipt && receipt.gasUsed >= transaction.gas) {
                    return reject('Ran out of gas, tx likely failed');
                  }

                  filter.stopWatching(() => null);
                  return resolve(txHash);
                });
              }
            }
          });
        });
      }
    });
  });
}
