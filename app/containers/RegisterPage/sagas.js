import { delay } from 'redux-saga';
import { take, put, call, fork, cancel } from 'redux-saga/effects';
import { startSubmit, stopSubmit, startAsyncValidation, stopAsyncValidation, change, touch } from 'redux-form/immutable';
import { CHANGE, INITIALIZE } from 'redux-form/lib/actionTypes';
import { push } from 'react-router-redux';
import * as accountService from '../../services/account';
import * as storageService from '../../services/localStorage';
import { setProgress } from '../App/actions';
import { conf } from '../../app.config';

import { REGISTER } from './constants';

export function* registerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(REGISTER);

    yield put(setProgress(-3000));
    yield put(startSubmit('register'));

    try {
      const response = yield call(
        accountService.register,
        payload.email,
        payload.captchaResponse,
        payload.origin,
        payload.referral
      );

      if (response.errorMessage) {
        throw new Error(response.errorMessage);
      }

      storageService.setItem('pendingEmail', payload.email);
      yield put(push('/confirm'));
    } catch (err) {
      const errors = {};
      if (err.status && err.status === 409) {
        errors.email = 'Email taken.';
        errors._error = { message: 'Registration failed!' }; // eslint-disable-line no-underscore-dangle
      } else if (err.message && err.message === 'Failed to fetch') {
        errors._error = { message: 'Registration failed due to interrupted connection, please try again', valid: true }; // eslint-disable-line no-underscore-dangle
      } else {
        errors._error = { message: `Registration failed with error code ${err.message || err}` }; // eslint-disable-line no-underscore-dangle
      }
      yield put(change('register', 'captchaResponse', false));
      yield put(stopSubmit('register', errors));
    } finally {
      yield put(setProgress(100));
    }
  }
}

function* validateRefCode(value) {
  yield call(delay, 200);

  if (value.length === 8) {
    yield put(startAsyncValidation('register'));

    try {
      yield call(accountService.checkReferral, value);
      yield put(stopAsyncValidation('register'));
    } catch (err) {
      const message = yield call(refCodeErrorByCode, err.status);

      yield put(
        stopAsyncValidation(
          'register',
          { referral: message },
        )
      );
      yield put(touch('register', 'referral'));
    }
  }
}

export function* refCodeValidationSaga() {
  let task;
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: value = '' } = yield take((action) => (
      action.type === CHANGE &&
      action.meta.form === 'register' &&
      action.meta.field === 'referral'
    ));

    if (task) {
      yield cancel(task);
    }

    task = yield fork(validateRefCode, value);
  }
}

export function* defaultRefCodeChecking() {
  const { defaultRefCode } = yield call(conf);
  try {
    const response = yield call(accountService.checkReferral, defaultRefCode);
    if (response.defaultRef) {
      yield put(change('register', 'defaultRef', defaultRefCode));
    }
  } catch (err) {} // eslint-disable-line no-empty
}

function refCodeErrorByCode(err) {
  switch (err) {
    case 418:
      return 'Referral code is no longer available';
    case 420:
      return 'Sorry, signup limit reached, try to signup later';
    case 400:
    case 404:
    default:
      return 'Invalid referral code';
  }
}

function* initalRefCodeValidationSaga() {
  const { payload } = yield take((action) => action.type === INITIALIZE && action.meta.form === 'register');
  const refCode = payload.get('referral') || '';
  if (refCode.length > 0) {
    yield call(validateRefCode, refCode);
  }
}

export default [
  registerSaga,
  refCodeValidationSaga,
  defaultRefCodeChecking,
  initalRefCodeValidationSaga,
];
