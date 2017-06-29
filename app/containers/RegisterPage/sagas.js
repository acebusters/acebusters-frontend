import { take, put, call } from 'redux-saga/effects';
import { startSubmit, stopSubmit, startAsyncValidation, stopAsyncValidation, change, touch } from 'redux-form/immutable';
import { CHANGE, INITIALIZE } from 'redux-form/lib/actionTypes';
import { push } from 'react-router-redux';
import account from '../../services/account';
import { setProgress } from '../App/actions';
import { conf } from '../../app.config';

import { REGISTER } from './constants';

export function* registerSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(REGISTER);

    yield put(setProgress(-3000));
    yield put(startSubmit('register'));

    try {
      yield call(
        account.register,
        payload.email,
        payload.captchaResponse,
        payload.origin,
        payload.referral
      );

      yield put(push('/confirm'));
    } catch (err) {
      const errors = {};
      if (err === 409) {
        errors.email = 'Email taken.';
        errors._error = 'Registration failed!'; // eslint-disable-line no-underscore-dangle
      } else {
        errors._error = `Registration failed with error code ${err}`; // eslint-disable-line no-underscore-dangle
      }
      yield put(stopSubmit('register', errors));
    } finally {
      yield put(setProgress(100));
    }
  }
}

function* validateRefCode(value) {
  if (value.length === 8) {
    yield put(startAsyncValidation('register'));

    try {
      yield call(account.checkReferral, value);
      yield put(stopAsyncValidation('register'));
    } catch (err) {
      const message = yield call(refCodeErrorByCode, err);

      yield put(
        stopAsyncValidation(
          'register',
          { referral: message },
        )
      );
    }
  }
}

export function* refCodeValidationSaga() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload: value = '' } = yield take((action) => (
      action.type === CHANGE &&
      action.meta.form === 'register' &&
      action.meta.field === 'referral'
    ));

    yield call(validateRefCode, value);
  }
}

export function* defaultRefCodeChecking() {
  const { defaultRefCode } = yield call(conf);
  try {
    const response = yield call(account.checkReferral, defaultRefCode);
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
  const refCode = payload.get('referral', '');
  if (refCode.length > 0) {
    yield call(validateRefCode, refCode);
    yield put(touch('register', 'referral'));
  }
}

export default [
  registerSaga,
  refCodeValidationSaga,
  defaultRefCodeChecking,
  initalRefCodeValidationSaga,
];
