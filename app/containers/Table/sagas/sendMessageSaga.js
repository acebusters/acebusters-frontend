import Raven from 'raven-js';

import TableService from '../../../services/tableService';

export function* sendMessage(action) {
  const table = new TableService(action.tableAddr, action.privKey);
  try {
    yield table.sendMessage(action.message);
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
    } });
  }
}
