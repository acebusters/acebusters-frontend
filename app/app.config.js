/**
 * Copyright (c) 2017 Acebusters
 * Use of this source code is governed by an ISC
 * license that can be found in the LICENSE file.
 */

const DEFAULT_REF_CODE = '00000000';

export function conf() {
  let sub = '';
  if (window && window.location && window.location.host) {
    sub = window.location.host.split('.')[0];
  }
  // ### PRODUCTION ENVIRONMENT CONFIG
  if (sub === 'app') {
    return {
      recaptchaKey: '',
      defaultRefCode: DEFAULT_REF_CODE,
      etherscanUrl: 'https://etherscan.io/',
      gethUrl: '',
      firstBlockHash: '',
      networkName: '',
      oracleUrl: '',
      txUrl: '',
      accountUrl: '',
      reservationUrl: '',
      gasStatUrl: '',
      ntzAddr: '',
      pwrAddr: '',
      accountFactory: '',
      tableFactory: '',
      sentryDSN: 'https://8c3e021848b247ddaf627c8040f94e07@sentry.io/153017',
      gaProperty: 'UA-98848213-1',
    };
  }

  // ### STAGING ENVIRONMENT CONFIG
  if (sub === 'beta') {
    return {
      recaptchaKey: '6LcE0RQUAAAAAEf6UWFsHEPedPBmRPAQiaSiWynN',
      defaultRefCode: DEFAULT_REF_CODE,
      etherscanUrl: 'https://rinkeby.etherscan.io/',
      gethUrl: 'ws://rinkeby.acebusters.com:8546',
      firstBlockHash: '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177',
      networkName: 'Rinkeby Testnet',
      oracleUrl: 'https://v83iq1161a.execute-api.eu-west-1.amazonaws.com/v0',
      txUrl: 'https://h5fb9klhzc.execute-api.eu-west-1.amazonaws.com/v0',
      accountUrl: 'https://vps13t4f7e.execute-api.eu-west-1.amazonaws.com/v0',
      reservationUrl: 'https://uiw0k5puaf.execute-api.eu-west-1.amazonaws.com/v0',
      gasStatUrl: '',
      ntzAddr: '0x8895dc6374f3198ac298857bc4a85ac225a87c6c',
      pwrAddr: '0x4a7ec091d4a28f8b2e6ed687bad330c2c8fe9846',
      accountFactory: '0x46a7e61dedd2abad8caf98d4da1205f830f62815',
      tableFactory: '0x9020237ffcc244a2d4bb202663494e0c0a3f9672',
      sentryDSN: 'https://8c3e021848b247ddaf627c8040f94e07@sentry.io/153017',
      gaProperty: 'UA-98848213-1',
    };
  }

  // ### SANDBOX ENVIRONMENT CONFIG
  return {
    recaptchaKey: '6LcE0RQUAAAAAEf6UWFsHEPedPBmRPAQiaSiWynN',
    defaultRefCode: DEFAULT_REF_CODE,
    etherscanUrl: 'https://rinkeby.etherscan.io/',
    gethUrl: 'ws://rinkeby.acebusters.com:8546',
    firstBlockHash: '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177',
    networkName: 'Rinkeby Testnet',
    oracleUrl: 'https://evm4rumeob.execute-api.eu-west-1.amazonaws.com/v0',
    txUrl: 'https://khengvfg6c.execute-api.eu-west-1.amazonaws.com/v0',
    accountUrl: 'https://hsqkzjp3m8.execute-api.eu-west-1.amazonaws.com/v0',
    reservationUrl: 'https://6er5q4s7b0.execute-api.eu-west-1.amazonaws.com/v0',
    gasStatUrl: 'https://4by2hfw9mg.execute-api.eu-west-1.amazonaws.com/v0',
    ntzAddr: '0x179237e4e955369a69bd26499e3b89f6df9e5d7b',
    pwrAddr: '0xff2aae8ac40d291b70b5f011c5eacb37f17eb9e4',
    accountFactory: '0x12a023f15ef0a1763f2a6736cc88a1ef9f0556f1',
    tableFactory: '0xbeb2f096f9438a4723b541db402d2dbf6bd86b17',
    sentryDSN: 'https://8c3e021848b247ddaf627c8040f94e07@sentry.io/153017',
    gaProperty: 'UA-XXXXX-Y',
  };
}

export const signerAddr = '0xdb2fdaf5b80c6a4c408e51b36ce7bbdd0c0852c4';
export const blocky = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADqklEQVR4Xu3d4XUTMRBFYbkFSkgtaQFKgBZSglsIJUAL1EIJaSHU4P10jpjk8pun1b65fjPryPbt7fXX+4J/P3+/gNql37/efRFYYfr93wIAqr/WCoASwAhCtSZgCYAFKAFKAETI5CVAQyARVAsg+xoCx0/BWP/x918CIAENgQ2BiJDJGwIbAomgWgDZ1xA4fgjC+o+//xIACWgIbAhEhEzeENgQSARxC6Cr/wd/TtX9q15fwXr9AFAHUR8Ah2cIrB/LAyAAGCJZoBYg7m3QlgAlwAaMri9RAlz3bouyBCgBtoB0dZES4Kpzm3QlQAmwCaVry5QA13zbpioBSoBtMF1ZqAS44tpGTQlQAmzE6fGlSoDHPduqKAFKgK1APbrY7f78RN8PcJrgR2/4o/1/PZIWAMOJCIDhBdTtB4A6OFwfAMMLqNsPAHVwuD4AhhdQtx8A6uBwfQAML6BuPwDUweH6ABheQN1+AKiDw/UBMLyAuv0AUAeH6wNgeAF1+wGgDg7XjwdAb+D0eYTT+9frHz8PoDcQAPaDHQGALeA0wHr9AAiAs2cCleBaQC0AX8MmPw2wXr8WYPXnbwrVBAuA4d8TGAD4wRA1EAOgBNACaITp9QPg8CeDAsB++VT9awjECNACaILp9QMgAHojSBjQV2AJ0FOA8MdPIbUAst9/M+jTJwD6/+nl2oKOJ8CnryAaEABo4HR5AEyvIO4/ANDA6fIAmF5B3H8AoIHT5QEwvYK4/wBAA6fLA2B6BXH/AYAGTpcHwPQK4v4DAA2cLg+A6RXE/QcAGjhdHgDTK4j7Pw4A7p/leqBCN6AF0Ourns8D6AZUHwDmYACYf3wmDy/P8gBAC2sBaKDKawHmYAlg/tUC0D+WlwBmYQlg/pUA6B/LSwCzsAQw/0oA9I/lJYBZWAKYfyUA+sfyEsAsLAHMvxIA/WN5CWAWlgDm3/wEWGu9iwf35yeRr5c/f0n/9vqL9Cr+8uMbLXHav1sAUP1WAJQARFAJUAsggLSF1gLI/lULOB1hDYE2RJcAJUCPgcJATwE9BQg/63QLrQVQ+RoCjxPcENgQiK9hkzcDNAMQQc0AvRNIAPVOYH8NJIB6CiD7PsBTwB1/NQz9Y3kngszCTgSZf/NPBJUARkAfDzf/WF0LMAtrAeZfLQD9Y3kJYBaWAOZfCYD+sbwEMAtLAPOvBED/WF4CmIUlgPlXAqB/LC8BzMISwPwrAdA/lpcAZmEJYP6VAOgfy0sAs/Af1PKArkvqmhoAAAAASUVORK5CYII=';
export const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
export const valuesShort = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const suits = ['c', 'd', 'h', 's'];
export const timeoutSeconds = 60;

// showStatus messages ***commented out means they are not implemented yet***
export const STATUS_MSG = {
  active: {
    type: 'seat',
    style: 'info',
    msg: 'active',
  },
  allIn: {
    type: 'action',
    style: 'warning',
    msg: 'all-in',
  },
  bet: {
    type: 'action',
    style: 'danger',
    msg: 'bet',
  },
  blindSmall: {
    type: 'action',
    style: 'info',
    msg: 'posted SB',
  },
  blindBig: {
    type: 'action',
    style: 'info',
    msg: 'posted BB',
  },
  call: {
    type: 'action',
    style: 'success',
    msg: 'call',
  },
  check: {
    type: 'action',
    style: 'success',
    msg: 'check',
  },
  fold: {
    type: 'action',
    style: 'info',
    msg: 'fold',
  },
  raise: {
    type: 'action',
    style: 'danger',
    msg: 'raise',
  },
  sitOut: {
    type: 'seat',
    style: 'info',
    msg: 'sit-out',
  },
  sittingIn: {
    type: 'seat',
    style: 'info',
    msg: 'sitting-in',
  },
  standingUp: {
    type: 'seat',
    style: 'info',
    msg: 'standing-up',
  },
  waiting: {
    type: 'seat',
    style: 'info',
    msg: 'waiting',
  },
  // winner: {
  //   type: 'action',
  //   style: 'warning',
  //   msg: 'winner',
  // },
};

export const ABI_TOKEN_CONTRACT = [{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_spender', type: 'address' }, { name: '_amountNtz', type: 'uint256' }], name: 'approve', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'admins', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_admin', type: 'address' }], name: 'removeAdmin', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_to', type: 'address' }, { name: '_amountNtz', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [], name: 'purchaseTokens', outputs: [], payable: true, type: 'function' }, { constant: true, inputs: [], name: 'floor', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_amountNtz', type: 'uint256' }, { name: '_data', type: 'bytes' }], name: 'transData', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_amountWei', type: 'uint256' }, { name: '_beneficiary', type: 'address' }], name: 'allocateEther', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'powerAddr', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_maxPower', type: 'uint256' }], name: 'setMaxPower', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newCeiling', type: 'uint256' }], name: 'moveCeiling', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_admin', type: 'address' }], name: 'addAdmin', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'ceiling', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_amountNtz', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_amountNtz', type: 'uint256' }], name: 'dilutePower', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'activeSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'reserve', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newFloor', type: 'uint256' }], name: 'moveFloor', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }], name: 'allowance', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_downTime', type: 'uint256' }], payable: false, type: 'constructor' }, { payable: true, type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: 'purchaser', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Purchase', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'seller', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Sell', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }];
export const ABI_POWER_CONTRACT = [{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'downs', outputs: [{ name: 'owner', type: 'address' }, { name: 'total', type: 'uint256' }, { name: 'left', type: 'uint256' }, { name: 'start', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_holder', type: 'address' }, { name: '_value', type: 'uint256' }, { name: '_data', type: 'bytes32' }], name: 'slashPower', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_maxPower', type: 'uint256' }], name: 'setMaxPower', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_pos', type: 'uint256' }, { name: '_holder', type: 'address' }, { name: '_value', type: 'uint256' }, { name: '_data', type: 'bytes32' }], name: 'slashDownRequest', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_pos', type: 'uint256' }, { name: '_now', type: 'uint256' }], name: 'vestedDown', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_pos', type: 'uint256' }, { name: '_now', type: 'uint256' }], name: 'downTickTest', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_holder', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_totalBabzBefore', type: 'uint256' }, { name: '_amountBabz', type: 'uint256' }], name: 'dilutePower', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_amountPower', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'activeSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_amountBabz', type: 'uint256' }, { name: '_data', type: 'bytes' }], name: 'tokenFallback', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'downtime', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_pos', type: 'uint256' }], name: 'downTick', outputs: [{ name: 'success', type: 'bool' }], payable: false, type: 'function' }, { inputs: [{ name: '_nutzAddr', type: 'address' }, { name: '_downtime', type: 'uint256' }], payable: false, type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'holder', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }, { indexed: false, name: 'data', type: 'bytes32' }], name: 'Slashing', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }];
export const ABI_ACCOUNT_FACTORY = [{ constant: true, inputs: [{ name: '_proxy', type: 'address' }], name: 'getSigner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_signer', type: 'address' }, { name: '_lockAddr', type: 'address' }], name: 'create', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_newSigner', type: 'address' }], name: 'handleRecovery', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_signer', type: 'address' }], name: 'getAccount', outputs: [{ name: '', type: 'address' }, { name: '', type: 'address' }, { name: '', type: 'bool' }], payable: false, type: 'function' }, { anonymous: false, inputs: [{ indexed: true, name: 'signer', type: 'address' }, { indexed: false, name: 'proxy', type: 'address' }], name: 'AccountCreated', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'newSigner', type: 'address' }, { indexed: false, name: 'proxy', type: 'address' }, { indexed: false, name: 'oldSigner', type: 'address' }], name: 'AccountRecovered', type: 'event' }];
export const ABI_TABLE = [{ constant: true, inputs: [], name: 'active', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getOut', outputs: [{ name: '', type: 'uint256' }, { name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'seats', outputs: [{ name: 'senderAddr', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'signerAddr', type: 'address' }, { name: 'exitHand', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_toggleReceipt', type: 'bytes' }], name: 'toggleActive', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_addr', type: 'address' }], name: 'inLineup', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_r', type: 'bytes32' }, { name: '_s', type: 'bytes32' }, { name: '_pl', type: 'bytes32' }], name: 'leave', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestTime', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastHandNetted', outputs: [{ name: '', type: 'uint32' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_sigs', type: 'bytes' }, { name: '_newBal1', type: 'bytes32' }, { name: '_newBal2', type: 'bytes32' }], name: 'settle', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'tokenAddr', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_now', type: 'uint256' }], name: 'netHelp', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'oracle', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_data', type: 'bytes32[]' }], name: 'submit', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'hands', outputs: [{ name: 'claimCount', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_handId', type: 'uint256' }, { name: '_addr', type: 'address' }], name: 'getIn', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'getLineup', outputs: [{ name: '', type: 'uint256' }, { name: 'addresses', type: 'address[]' }, { name: 'amounts', type: 'uint256[]' }, { name: 'exitHands', type: 'uint256[]' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'lastNettingRequestHandId', outputs: [{ name: '', type: 'uint32' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_value', type: 'uint256' }, { name: '_data', type: 'bytes' }], name: 'tokenFallback', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [], name: 'net', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'smallBlind', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { inputs: [{ name: '_token', type: 'address' }, { name: '_oracle', type: 'address' }, { name: '_smallBlind', type: 'uint256' }, { name: '_seats', type: 'uint256' }], payable: false, type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'addr', type: 'address' }, { indexed: false, name: 'amount', type: 'uint256' }], name: 'Join', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'NettingRequest', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'hand', type: 'uint256' }], name: 'Netted', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'addr', type: 'address' }], name: 'Leave', type: 'event' }];

export const ABI_PROXY = [{ constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transfer', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'getOwner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'isLocked', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_from', type: 'address' }, { name: '_value', type: 'uint256' }, { name: '_data', type: 'bytes' }], name: 'tokenFallback', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_r', type: 'bytes32' }, { name: '_s', type: 'bytes32' }, { name: '_pl', type: 'bytes32' }], name: 'unlock', outputs: [], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_destination', type: 'address' }, { name: '_value', type: 'uint256' }, { name: '_data', type: 'bytes' }], name: 'forward', outputs: [], payable: false, type: 'function' }, { inputs: [{ name: '_owner', type: 'address' }, { name: '_lockAddr', type: 'address' }], payable: false, type: 'constructor' }, { payable: true, type: 'fallback' }, { anonymous: false, inputs: [{ indexed: true, name: 'sender', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Deposit', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }, { indexed: false, name: 'data', type: 'bytes' }], name: 'Withdrawal', type: 'event' }];

export const ABI_TABLE_FACTORY = [{ constant: false, inputs: [{ name: '_newOwner', type: 'address' }], name: 'transfer', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'getTables', outputs: [{ name: '', type: 'address[]' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '_addr', type: 'address' }], name: 'isOwner', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'tables', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_smallBlind', type: 'uint96' }, { name: '_seats', type: 'uint256' }], name: 'create', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'tokenAddress', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'oracleAddress', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: '_token', type: 'address' }, { name: '_oracle', type: 'address' }], name: 'configure', outputs: [], payable: false, type: 'function' }];

export const TIMEOUT_PERIOD = 60;

// chip values and colors
export const chipValues = [
  [50000000000000000, '#f056c5'],
  [10000000000000000, '#e7e401'],
  [5000000000000000, '#774ac1'],
  [1000000000000000, '#ac2a2a'],
  [500000000000000, '#328eee'],
  [100000000000000, '#745f2a'],
  [10000000000000, '#FF0080'],
  [1000000000000, '#FFFFFF'],
];

export const SEAT_COORDS = [
  [10, 40, 0],
  [90, 40, 0],
  [40, 12.5, 0],
  [60, 12.5, 0],
  [40, 71, 0],
  [60, 71, 0],
  [21, 21, 0],
  [79, 21, 0],
  [21, 60, 0],
  [79, 60, 0],
];


export const AMOUNT_COORDS = [
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
  [3, 4, 0],
];
