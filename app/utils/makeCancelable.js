/*
 * Based on https://github.com/facebook/react/issues/5465#issuecomment-157888325
 */

export const makeCancelable = (promise) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => hasCanceled ? reject({ isCanceled: true }) : resolve(val),
      (error) => hasCanceled ? reject({ isCanceled: true }) : reject(error)
    );
  });

  wrappedPromise.cancel = () => {
    hasCanceled = true;
  };

  return wrappedPromise;
};
