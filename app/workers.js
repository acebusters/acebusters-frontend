import createWorkerMiddleware from 'redux-worker-middleware';

const LoginWorker = require('worker-loader!../app/containers/LoginPage/worker.js');
const loginWorker = new LoginWorker();

const GenerateWorker = require('worker-loader!../app/containers/GeneratePage/worker.js');
const generateWorker = new GenerateWorker();

const loginWorkerMiddleware = createWorkerMiddleware(loginWorker);
const generateWorkerMiddleware = createWorkerMiddleware(generateWorker);

export default [loginWorkerMiddleware, generateWorkerMiddleware];
