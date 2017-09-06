import { takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

export function* updateGTMOnLocationChange(action) {
  window.dataLayer = window.dataLayer || [];
  if (action.payload.pathname === '/login' || action.payload.pathname === '/register') {
    window.dataLayer.push({
      event: 'LOCATION_CHANGE',
      pathname: action.payload.pathname,
    });
  }
}

export default function* gtmSaga() {
  yield takeEvery(LOCATION_CHANGE, updateGTMOnLocationChange);
}
