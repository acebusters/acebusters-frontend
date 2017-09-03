import Raven from 'raven-js';
import { put, call } from 'redux-saga/effects';

import { getHand } from '../../../services/tableService';

import { updateReceived } from '../actions';

export function* handRequest(action) {
  try {
    const tableState = yield call(getHand, action.tableAddr, action.handId);
    yield put(updateReceived(action.tableAddr, tableState));
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}
