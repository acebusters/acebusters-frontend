/**
 * Created by helge on 07.10.16.
 */

// ABIs
// const ABI_TOKEN_CONTRACT = [{ constant: false, inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'approve', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'revoke', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'changeOwner', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'baseUnit', outputs: [{ name: '', type: 'uint96' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'issue', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }, { name: '_spender', type: 'address' }], name: 'allowance', outputs: [{ name: 'remaining', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_baseUnit', type: 'uint96' }], type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Issuance', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Revoke', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'sender', type: 'address' }, { indexed: false, name: 'code', type: 'uint256' }], name: 'Error', type: 'event' }];
// const ABI_TABLE_CONTRACT = [{ constant: false, inputs: [{ name: '_leaveReceipt', type: 'bytes' }], name: 'leave', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getOut', outputs: [{ name: '', type: 'uint96' }, { name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'seats', outputs: [{ name: 'addr', type: 'address' }, { name: 'amount', type: 'uint96' }, { name: 'lastHand', type: 'uint256' }, { name: 'conn', type: 'bytes32' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestTime', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastHandNetted', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newBalances', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'settle', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [], name: 'payout', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'oracle', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_buyIn', type: 'uint96' }, { name: '_conn', type: 'bytes32' }], name: 'join', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getIn', outputs: [{ name: '', type: 'uint96' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'getLineup', outputs: [{ name: '', type: 'uint256' }, { name: 'addr', type: 'address[]' }, { name: 'amount', type: 'uint256[]' }, { name: 'lastHand', type: 'uint256[]' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_bets', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'submitBets', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestHandId', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'smallBlind', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_now', type: 'uint256' }], name: 'net', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_dists', type: 'bytes' }, { name: '_sigs', type: 'bytes' }], name: 'submitDists', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_token', type: 'address' }, { name: '_oracle', type: 'address' }, { name: '_smallBlind', type: 'uint256' }, { name: '_seats', type: 'uint256' }], type: 'constructor' }, { anonymous: false, inputs: [{ indexed: false, name: 'addr', type: 'address' }, { indexed: false, name: 'conn', type: 'bytes32' }, { indexed: false, name: 'amount', type: 'uint256' }], name: 'Join', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'NettingRequest', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'Netted', type: 'event' }];
// Actions

export const GET_BALANCE = 'GET_BALANCE';
export const GET_TABLES = 'GET_TABLES';
export const JOIN_TABLE = 'JOIN_TABLE';

// mocked objects
const tables = [{
  id: '1',
  name: 'Helges Hell',
  players: [],
}, {
  id: '2',
  name: 'Johanns Jojo',
  players: [],
},
  {
    id: '3',
    name: 'Alvaros Aktenkammer',
    players: [],
  }];

export function getBalance() {
  const payload = new Promise((resolve) => {
    resolve({ balance: 20000 });
  });

  return {
    type: GET_BALANCE,
    payload,
  };
}


export function getTables() {
  const payload = new Promise((resolve) => {
    resolve({ tables });
  });

  return {
    type: GET_TABLES,
    payload,
  };
}


export function joinTable(id) {
  return {
    type: JOIN_TABLE,
    tableId: id,
  };
}
