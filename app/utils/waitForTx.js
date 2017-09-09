import { promisifyContractCall } from './promisifyContractCall';

export function waitForTx(web3, txHash) {
  const getTransaction = promisifyContractCall(web3.eth.getTransaction);
  let transaction;

  return new Promise((resolve, reject) => {
    const filter = web3.eth.filter('latest');
    getTransaction(txHash).then((_transaction) => {
      transaction = _transaction;
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

      if (transaction) {
        // maybe tx already mined and watch wouldn't catch it, so we need to check receipt
        checkReceipt();
      }

      filter.watch(async (err, blockHash) => {
        if (err) {
          reject(err);
          filter.stopWatching(() => null);
        }

        transaction = transaction || await getTransaction(txHash);

        if (transaction) {
          web3.eth.getBlock(blockHash, true, (blockErr, block) => {
            if (!blockErr && block.transactions.some((tx) => tx.hash === txHash)) {
              checkReceipt();
            }
          });
        }
      });
    });
  });
}
