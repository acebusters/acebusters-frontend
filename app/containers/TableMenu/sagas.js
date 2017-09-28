import { takeEvery } from 'redux-saga/effects';
import { MUTE, UNMUTE } from './actions';
import * as storageService from '../../services/localStorage';

function* muteScanner() {
  storageService.setItem('muted', true);
}

function* unmuteScanner() {
  storageService.removeItem('muted');
}

export function* tableMenuSaga() {
  yield takeEvery(MUTE, muteScanner);
  yield takeEvery(UNMUTE, unmuteScanner);
}

export default [
  tableMenuSaga,
];
