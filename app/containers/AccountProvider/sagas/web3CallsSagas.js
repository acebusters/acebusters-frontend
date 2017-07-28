import { put, call } from 'redux-saga/effects';
import { web3MethodSuccess, web3MethodError, contractMethodSuccess, contractMethodError } from '../actions';

// TODO handle errors
function callMethod({ method, args }) {
  return new Promise((resolve, reject) => {
    try {
      method(...args, (err, value) => {
        if (err) {
          return reject(err);
        }
        return resolve(value);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function* web3MethodCallSaga({ payload: { method, args, key } }) {
  try {
    const value = yield call(callMethod, { method, args });
    yield put(web3MethodSuccess({ key, payload: { value, updated: new Date() } }));
  } catch (err) {
    yield put(web3MethodError({ key, err }));
  }
}

export function* contractMethodCallSaga({ payload: { method, args, key, address } }) {
  try {
    const value = yield call(callMethod, { method, args });
    yield put(contractMethodSuccess({ address, key, payload: { value, updated: new Date() } }));
  } catch (err) {
    yield put(contractMethodError({ address, key, err }));
  }
}
