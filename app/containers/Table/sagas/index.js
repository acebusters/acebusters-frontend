import { takeEvery, fork } from 'redux-saga/effects';
import { PokerHelper, ReceiptCache } from 'poker-helper';

import { BET, SHOW, NET, HAND_REQUEST, LINEUP_RECEIVED, SEND_MESSAGE } from '../actions';
import { sendMessage } from './sendMessageSaga';
import { performBet } from './performBetSaga';
import { performShow } from './performShowSaga';
import { submitSignedNetting } from './submitSignedNettingSaga';
import { handRequest } from './handRequestSaga';
import { sitoutFlow } from './sitoutFlowSaga';
import { updateScanner } from './updateScannerSaga';
import { payFlow } from './payFlowSaga';
import { lineupScanner } from './lineupScannerSaga';
import { reservationSaga } from './reservationSaga';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

export function* tableStateSaga(dispatch) {
  yield takeEvery(SEND_MESSAGE, sendMessage);
  yield takeEvery(BET, performBet);
  yield takeEvery(SHOW, performShow);
  yield takeEvery(NET, submitSignedNetting);
  yield takeEvery(HAND_REQUEST, handRequest);
  yield takeEvery(LINEUP_RECEIVED, lineupScanner, dispatch);

  yield fork(payFlow, pokerHelper);
  yield fork(updateScanner, pokerHelper);
  yield fork(sitoutFlow);
  yield fork(reservationSaga);
}
