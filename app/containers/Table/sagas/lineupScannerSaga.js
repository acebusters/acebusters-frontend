import { select } from 'redux-saga/effects';

import { makeSelectPrivKey } from '../../AccountProvider/selectors';
import { makeMyPendingSeatSelector, makeLastReceiptSelector } from '../../Seat/selectors';

import { makeHandSelector, makeMyPosSelector, makeSitoutAmountSelector } from '../selectors';
import { bet, sitOutToggle } from '../actions';

export function* lineupScanner(dispatch, action) {
  if (!action.handId) {
    return;
  }

  if (action.myPendingSeat === -1) {
    return;
  }

  const params = { params: { tableAddr: action.tableAddr, handId: action.handId } };
  const myPendingSeat = yield select(makeMyPendingSeatSelector(), params);
  const myPos = yield select(makeMyPosSelector(), params);

  if (myPendingSeat === -1 && myPos === action.myPendingSeat) {
    const hand = yield select(makeHandSelector(), params).toJS();
    if (hand.state !== 'waiting' && hand.state !== 'dealing') {
      const privKey = yield select(makeSelectPrivKey(), params);
      const sitoutAmount = yield select(makeSitoutAmountSelector(), params);
      const lastReceipt = yield select(makeLastReceiptSelector(), params);
      const handId = parseInt(action.handId, 10);
      const sitoutAction = bet(
        action.tableAddr,
        handId,
        sitoutAmount,
        privKey,
        myPos,
        lastReceipt,
      );
      yield sitOutToggle(sitoutAction, dispatch);
    }
  }
}
