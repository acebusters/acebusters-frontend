import { put } from 'redux-saga/effects';
import Raven from 'raven-js';

import TableService from '../../../services/tableService';

import { setCards } from '../actions';

export function* performBet(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    const { cards } = yield table.bet(action.handId, action.amount);
    if (cards) {
      yield put(setCards(action.tableAddr, action.handId, cards));
    }
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}
