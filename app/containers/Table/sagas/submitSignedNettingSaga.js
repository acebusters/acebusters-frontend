import ethUtil from 'ethereumjs-util';
import Raven from 'raven-js';

import TableService from '../../../services/tableService';

export function* submitSignedNetting(action) {
  try {
    // TODO(ab): check against actual balances here

    // sign balances here
    let payload = new Buffer(action.balances.replace('0x', ''), 'hex');
    const priv = new Buffer(action.privKey.replace('0x', ''), 'hex');
    const hash = ethUtil.sha3(payload);
    const sig = ethUtil.ecsign(hash, priv);
    payload = `0x${sig.v.toString(16)}${sig.r.toString('hex')}${sig.s.toString('hex')}`;
    const table = new TableService(action.tableAddr, action.privKey);
    yield table.net(action.handId, payload);
  } catch (err) {
    Raven.captureException(err, { tags: {
      tableAddr: action.tableAddr,
      handId: action.handId,
    } });
  }
}
