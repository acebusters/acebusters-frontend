import React from 'react';
import { call, put } from 'redux-saga/effects';

import { isSupportedBrowser } from '../../../utils/';
import { setItem, getItem } from '../../../services/localStorage';

import { modalAdd } from '../actions';
import UnsupportedBrowser from '../UnsupportedBrowser';

export default function* unsupportedModalSaga() {
  const isSupported = yield call(isSupportedBrowser);
  const latestShow = Number(yield call(getItem, 'bro_support_show_ts'));
  if (!isSupported && (Date.now() - (latestShow || 0)) > 3600 * 1000) {
    yield put(modalAdd(
      <UnsupportedBrowser />
    ));
    yield call(setItem, 'bro_support_show_ts', Date.now());
  }
}
