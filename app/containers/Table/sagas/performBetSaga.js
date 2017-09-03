import { put } from 'redux-saga/effects';
import Raven from 'raven-js';

import TableService from '../../../services/tableService';

import { setCards } from '../actions';

export function* performBet(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    const holeCards = yield table.bet(action.handId, action.amount);
    yield put(setCards(action.tableAddr, action.handId, holeCards.cards));
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}
