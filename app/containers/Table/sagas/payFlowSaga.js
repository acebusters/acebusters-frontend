import { put, select, take } from 'redux-saga/effects';
import Raven from 'raven-js';

import TableService from '../../../services/tableService';

import { receiptSet, pay, BET, FOLD, CHECK } from '../actions';
import { makeSbSelector, makeLatestHandSelector, makeLineupSelector, makeHandSelector } from '../selectors';


export function* payFlow(pokerHelper) {
  while (true) { //eslint-disable-line
    const req = yield take(pay.REQUEST);
    const action = req.payload;
    const table = new TableService(action.tableAddr, action.privKey);

    try {
      const tableAddr = action.tableAddr;
      const lastHandId = yield select(makeLatestHandSelector(), { params: { tableAddr } });
      const fakeProps = { params: { tableAddr, handId: lastHandId } };
      const lastHand = yield select(makeHandSelector(), fakeProps);
      const sb = yield select(makeSbSelector(), fakeProps);
      const bb = sb * 2;
      const dealer = lastHand.get('dealer');
      const state = lastHand.get('state');
      const newReceipt = (function getNewReceipt() {
        switch (action.type) {
          case BET:
            return table.betReceipt(action.handId, action.amount);
          case FOLD:
            return table.foldReceipt(action.handId, action.amount);
          case CHECK: {
            switch (action.checkType) {
              case 'preflop':
                return table.checkPreflopReceipt(action.handId, action.amount);
              case 'flop':
                return table.checkFlopReceipt(action.handId, action.amount);
              case 'river':
                return table.checkRiverReceipt(action.handId, action.amount);
              case 'turn':
                return table.checkTurnReceipt(action.handId, action.amount);
              default:
                throw new Error('Invalid check type in payFlow. check type: ', action.checkType);
            }
          }
          default:
            throw new Error('Invalid action type in payFlow. type: ', action.type);
        }
      }());

      const lineup = (yield select(makeLineupSelector(), fakeProps)).toJS();
      lineup[action.pos].last = newReceipt;

      const isBettingDone = pokerHelper.isBettingDone(lineup, dealer, state, bb);

      // Note: the only case we want to prevent faking receipt in advance is that
      // after preflop there could be chances that the last player in preflop hand
      // becomes the first player in this flop hand
      if (!(isBettingDone && state === 'preflop')) {
        yield put(receiptSet(action.tableAddr, action.handId, action.pos, newReceipt));
      }
      const holeCards = yield table.pay(newReceipt);
      yield put({ type: pay.SUCCESS, payload: holeCards.cards });
    } catch (err) {
      // unset toggle flag
      yield put(receiptSet(action.tableAddr, action.handId, action.pos, action.prevReceipt));
      Raven.captureException(err, { tags: {
        tableAddr: action.tableAddr,
        handId: action.handId,
      } });
      yield put({ type: pay.FAILURE, payload: err });
    }
  }
}
