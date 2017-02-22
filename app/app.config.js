/**
 * Created by helge on 05.08.16.
 */

export const apiBasePath = 'https://evm4rumeob.execute-api.eu-west-1.amazonaws.com/v0';
export const ethNode = 'http://geth.ocolin.com:8545';
export const ethNodeUrl = 'http://geth.ocolin.com:8545';
export const tokenContractAddress = '0x7c08ca8bef208ac8be8cd03ad15fbef643dd355c';
export const accountFactoryAddress = '0x297622d34794164495c388387596908635b3d005';
export const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
export const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

export const ABI_TOKEN_CONTRACT = [{ constant: false, inputs: [{ name: '_spender', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'approve', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'revoke', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'changeOwner', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'baseUnit', outputs: [{ name: '', type: 'uint96' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_value', type: 'uint256' }], name: 'issue', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }, { name: '_spender', type: 'address' }], name: 'allowance', outputs: [{ name: 'remaining', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_baseUnit', type: 'uint96' }], type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Issuance', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Revoke', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'sender', type: 'address' }, { indexed: false, name: 'code', type: 'uint256' }], name: 'Error', type: 'event' }];
export const ABI_ACCOUNT_FACTORY = [{ constant: true, inputs: [{ name: '', type: 'address' }], name: 'signerToProxy', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_signer', type: 'address' }, { name: '_recovery', type: 'address' }, { name: '_timeLock', type: 'uint256' }], name: 'create', outputs: [], payable: false, type: 'function' }, { anonymous: false, inputs: [{ indexed: true, name: 'signer', type: 'address' }, { indexed: false, name: 'proxy', type: 'address' }, { indexed: false, name: 'controller', type: 'address' }, { indexed: false, name: 'recovery', type: 'address' }], name: 'AccountCreated', type: 'event' }];

export const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
export const ABI_ALL_IN = [{ name: 'allIn', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
export const ABI_FOLD = [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
export const ABI_SIT_OUT = [{ name: 'sitOut', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

export const checkABIs = {
  flop: [{ name: 'checkFlop', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  turn: [{ name: 'checkTurn', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  river: [{ name: 'checkRiver', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
};

export const ABI_SHOW = [{ name: 'show', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
export const ABI_MUCK = [{ name: 'muck', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

export const SEAT_COORDS = {
  2: [[0, 0], [0, 0]],
  4: [[37, -25], [99, 42], [37, 102], [-20, 42]],
  6: [[-20, -10], [-15, 0]],
  10: [[-20, -10], [-15, 0]],
};

export const AMOUNT_COORDS = {
  2: [[0, 0], [0, 0]],
  4: [[0, 100], [-160, 0], [0, -100], [125, 0]],
  6: [[-20, -10], [-15, 0]],
  10: [[-20, -10], [-15, 0]],
};

export const computedStyles = () => {
  const computed = {};
  computed.d = window.innerWidth;
  computed.b = (document.getElementById('table-info')) ? document.getElementById('table-info').clientWidth : 0;
  computed.h = 1.6;
  computed.a = 0.96;
  computed.e = 100;
  computed.f = computed.d - computed.b - computed.e;
  computed.g = window.innerHeight;
  computed.z = (document.getElementById('action-bar')) ? document.getElementById('action-bar').clientHeight : 0;
  computed.y = this.g - this.z;
  computed.computeSize = () => {
    let k;
    let c;
    const obj = {};
    if (computed.y < computed.f / computed.h) {
      k = computed.y * computed.a;
      c = k * computed.h;
    } else {
      c = computed.f * computed.a;
      k = (c / computed.h);
    }
    obj.width = c;
    obj.height = k;
    return obj;
  };
  return computed;
};

