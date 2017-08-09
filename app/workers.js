/* eslint-disable global-require */
import createWorkerMiddleware from './worker-middleware';

export default [
  createWorkerMiddleware('login', () => require('worker-loader!../app/containers/LoginPage/worker.js')),
  createWorkerMiddleware('generate', () => require('worker-loader!../app/containers/GeneratePage/worker.js')),
];
