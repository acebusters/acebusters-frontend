const createWorkerMiddleware = (workerName, workerRequire) => {
  let worker = null;

  return ({ dispatch }) =>
    (next) => {
      if (!next) {
        throw new Error(
          'Worker middleware received no `next` action. Check your chain of middlewares.',
        );
      }

      return (action) => {
        if (action.meta && action.meta.WebWorker && action.meta.WebWorker === workerName) {
          // load worker once
          if (!worker) {
            const LoadedWorker = workerRequire();
            worker = new LoadedWorker();
            worker.onmessage = ({ data: resultAction }) => {
              dispatch(resultAction);
            };
          }

          worker.postMessage(action);
        }
        // always pass the action along to the next middleware
        return next(action);
      };
    };
};

export default createWorkerMiddleware;
