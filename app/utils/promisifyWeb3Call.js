export function promisifyWeb3Call(method) {
  return (...args) => new Promise((resolve, reject) => {
    method(
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
