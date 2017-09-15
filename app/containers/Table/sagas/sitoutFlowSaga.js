import { put, take } from 'redux-saga/effects';
import Raven from 'raven-js';

import TableService from '../../../services/tableService';

import { sitOutToggle } from '../actions';

export function* sitoutFlow() {
  while (true) { //eslint-disable-line
    const req = yield take(sitOutToggle.REQUEST);
    const action = req.payload;
    try {
      const table = new TableService(action.tableAddr, action.privKey);
      const receipt = yield table.sitOut(action.handId, action.amount);
      yield put({ type: sitOutToggle.SUCCESS, payload: receipt });
    } catch (err) {
      Raven.captureException(err, {
        tags: {
          tableAddr: action.tableAddr,
          handId: action.handId,
        },
      });
    }
  }
}
