export function promisifyContractCall(contract, method) {
  return (...args) => new Promise((resolve, reject) => {
    contract[method].call(
      ...args,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}
