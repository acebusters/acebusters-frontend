import { call, put, takeLatest, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { HANDLE_CLICK_BUTTON, BET_SET, updateActionBar } from './actions';
import { playActionBarClick } from '../../sounds';
import { makeSelectIsMuted } from '../TableMenu/selectors';

function* handleClickButton({ buttonType }) {
  const isMuted = yield select(makeSelectIsMuted());
  if (!isMuted) {
    yield call(playActionBarClick);
  }
  yield delay(200);
  const update = {};
  // tracks onMouseDown
  update.buttonActive = buttonType;
  // tracks bet/raise process (BET_SET > BET)
  update.mode = buttonType;

  // have container call action method for specific buttonTypes
  if (buttonType === BET_SET) {
    update.sliderOpen = true;
  } else {
    update.executeAction = true;
    update.sliderOpen = false;
  }
  yield put(updateActionBar(update));
}

export function* actionBarSaga() {
  yield takeLatest(HANDLE_CLICK_BUTTON, handleClickButton);
}

export default [
  actionBarSaga,
];
