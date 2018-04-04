import Raven from 'raven-js';
import { put, select, takeEvery } from 'redux-saga/effects';
import { missingHandSelector } from '../selectors';
import tableReducer from '../reducer';
import * as reservationService from '../../../services/reservationService';
import { fetchTableState, getHand } from '../../../services/tableService';

import {
  tableLoadError,
  lineupReceived,
  reservationReceived,
  updateReceived,
  tableLoadSuccess, LOAD_TABLE,
} from '../actions';

import { getWeb3 } from '../../AccountProvider/utils';
import { ABI_TABLE } from '../../../app.config';
import { promisifyWeb3Call } from '../../../utils/promisifyWeb3Call';

function* loadHands(tableAddr, tableState) {
  const state = yield select();
  // reduce table state manually to predict missing hands
  const newTableState = tableReducer(state.get('table'), updateReceived(tableAddr, tableState));
  const missingHands = missingHandSelector(newTableState.get(tableAddr)) || [];
  // fetch hands that we might need for stack calculation
  const promises = missingHands.map((handId) => getHand(tableAddr, handId));
  return yield Promise.all(promises);
}

export function* loadTable(action) {
  const { tableAddr } = action;
  const table = getWeb3().eth.contract(ABI_TABLE).at(tableAddr);
  try {
    const lineup = yield promisifyWeb3Call(table.getLineup)();

    if (lineup[1].length === 0) {
      throw new Error('Table doesn\'t exists');
    }

    const [smallBlind, blindLevelDuration, reservation, tableState] = yield Promise.all([
      promisifyWeb3Call(table.smallBlind)(0),
      promisifyWeb3Call(table.blindLevelDuration)(),
      reservationService.lineup(tableAddr),
      fetchTableState(tableAddr),
    ]);

    yield put(lineupReceived(tableAddr, lineup, undefined, undefined, smallBlind, blindLevelDuration));
    const states = [
      tableState,
      ...yield loadHands(tableAddr, tableState),
    ];
    yield states.map((state) => put(updateReceived(tableAddr, state)));
    yield put(reservationReceived(tableAddr, reservation));
    yield put(tableLoadSuccess(tableAddr));
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr,
    } });
    yield put(tableLoadError(tableAddr));
  }
}

export function* loadTableSaga() {
  yield takeEvery(LOAD_TABLE, loadTable);
}

