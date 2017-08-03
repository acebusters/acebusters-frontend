export function waitForTx(web3, txHash) {
  return new Promise((resolve, reject) => {
    const filter = web3.eth.filter('latest');
    web3.eth.getTransaction(txHash, (txError, transaction) => {
      const checkReceipt = () => {
        web3.eth.getTransactionReceipt(txHash, (receipErr, receipt) => {
          if (receipt) {
            if (receipt.gasUsed >= transaction.gas) {
              reject('Ran out of gas, tx likely failed');
            } else {
              filter.stopWatching(() => null);
              resolve(txHash);
            }
          }
        });
      };

      if (txError) {
        reject(txError);
      } else {
        // maybe tx already mined and watch wouldn't catch it, so we need to check receipt
        checkReceipt();

        filter.watch((err, blockHash) => {
          if (err) {
            reject(err);
            filter.stopWatching(() => null);
          }

          web3.eth.getBlock(blockHash, true, (blockErr, block) => {
            if (!blockErr && block.transactions.some((tx) => tx.hash === txHash)) {
              checkReceipt();
            }
          });
        });
      }
    });
  });
}
