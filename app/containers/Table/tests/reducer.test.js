import EWT from 'ethereum-web-token';
import BigNumber from 'bignumber.js';
import { fromJS } from 'immutable';

import tableReducer from '../reducer';
import {
  updateReceived,
  setCards,
  pendingToggle,
  lineupReceived,
} from '../actions';

import { ABI_BET } from '../../../app.config';

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

// secretSeed: 'stadium today then top toward crack faint similar mosquito hunt thing sibling'
const P3_ADDR = '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc';

const ADDR_EMPTY = '0x0000000000000000000000000000000000000000';

const tableAddr = '0x112233';

describe('table reducer tests', () => {
  it('should recalculate lastRoundMaxBet if state changed', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
      last: new EWT(ABI_BET).bet(1, 50).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new EWT(ABI_BET).bet(1, 50).sign(P2_KEY),
    }];
    const before = fromJS({
      [tableAddr]: {
        0: {
          dealer: 0,
          changed: 123,
          state: 'flop',
          lineup,
          lastRoundMaxBet: 20,
        } },
    });

    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      changed: 234,
      state: 'turn',
      lineup,
    }));

    // check state after execution
    const after = before
      .setIn([tableAddr, '0', 'state'], 'turn')
      .setIn([tableAddr, '0', 'changed'], 234)
      .setIn([tableAddr, '0', 'lastRoundMaxBet'], 50);
    expect(nextState).toEqual(after);
  });

  it('should put sitout at right position into lineup', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
    }, {
      address: P2_ADDR,
    }];

    const before = fromJS({
      [tableAddr]: {
        0: {
          dealer: 0,
          state: 'flop',
          changed: 10,
          lineup,
        } },
    });

    const newLineup = [{
      address: P1_ADDR,
      sitout: 'timeout',
    }, {
      address: P2_ADDR,
    }];
    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      state: 'flop',
      changed: 20,
      lineup: newLineup,
    }));

    // check state after execution
    const after = before
      .setIn([tableAddr, '0', 'lineup'], fromJS(newLineup))
      .setIn([tableAddr, '0', 'changed'], 20);
    expect(nextState).toEqual(after);
  });

  it('should add last receipts into lineup', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
    }, {
      address: P2_ADDR,
    }];
    const before = fromJS({
      [tableAddr]: {
        0: {
          dealer: 0,
          state: 'flop',
          changed: 10,
          lineup,
        } },
    });

    const newLineup = [{
      address: P1_ADDR,
      last: new EWT(ABI_BET).bet(1, 50).sign(P1_KEY),
    }, {
      address: P2_ADDR,
    }];
    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      changed: 20,
      state: 'flop',
      lineup: newLineup,
    }));

    // check state after execution
    const after = before
      .setIn([tableAddr, '0', 'lineup'], fromJS(newLineup))
      .setIn([tableAddr, '0', 'changed'], 20);
    expect(nextState).toEqual(after);
  });

  it('should add distribution to hand', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
    }, {
      address: P2_ADDR,
    }];
    const before = fromJS({
      [tableAddr]: {
        0: {
          dealer: 0,
          state: 'flop',
          changed: 10,
          lineup,
        } },
    });

    const dist = 'ey123';
    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      changed: 20,
      state: 'flop',
      lineup,
      distribution: dist,
    }));

    // check state after execution
    const after = before
      .setIn([tableAddr, '0', 'changed'], 20)
      .setIn([tableAddr, '0', 'distribution'], dist);
    expect(nextState).toEqual(after);
  });

  it('should not recalculate lastRoundMaxBet if state did not change', () => {
    // set up previous state
    const bet1 = new EWT(ABI_BET).bet(1, 100).sign(P1_KEY);
    const before = fromJS({
      [tableAddr]: {
        1: {
          dealer: 1,
          changed: 123,
          state: 'flop',
          lineup: [{
            address: P1_ADDR,
            last: bet1,
          }, {
            address: P2_ADDR,
            time: 0,
            last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
          }],
          lastRoundMaxBet: 100,
        } },
    });

    // execute action
    const newBet = new EWT(ABI_BET).bet(1, 150).sign(P2_KEY);
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 1,
      dealer: 1,
      changed: 234,
      state: 'flop',
      lineup: [{
        address: P1_ADDR,
        last: bet1,
      }, {
        address: P2_ADDR,
        time: 1,
        last: newBet,
      }],
    }));

    // check state after execution
    const after = before
      .setIn([tableAddr, '1', 'lineup', 1, 'last'], newBet)
      .setIn([tableAddr, '1', 'changed'], 234)
      .setIn([tableAddr, '1', 'lineup', 1, 'time'], 1)
      .setIn([tableAddr, '1', 'lastRoundMaxBet'], 100);
    expect(nextState).toEqual(after);
  });

  it('should add amount into lineup', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {},
    });

    // execute action
    const nextState = tableReducer(before, lineupReceived(tableAddr, [
      new BigNumber(0),
      [P1_ADDR, P2_ADDR, P3_ADDR],
      [new BigNumber(3000), new BigNumber(3000), new BigNumber(2000)],
      [new BigNumber(0), new BigNumber(0), new BigNumber(0)],
    ], new BigNumber(0)));

    // check state after execution
    expect(nextState).toEqual(fromJS({
      [tableAddr]: {
        data: {
          seats: [{
            address: P1_ADDR,
          }, {
            address: P2_ADDR,
          }, {
            address: P3_ADDR,
          }],
          amounts: [3000, 3000, 2000],
          lastHandNetted: 0,
          smallBlind: 0,
        } },
    }));
  });

  it('should add holeCards', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {
        2: {
          lineup: [{
            address: P1_ADDR,
          }, {
            address: P2_ADDR,
          }],
        } },
    });

    // execute action
    const nextState = tableReducer(before, setCards(tableAddr, 2, [2, 3]));

    // check state after execution
    const after = before.setIn([tableAddr, '2', 'holeCards'], fromJS([2, 3]));
    expect(nextState).toEqual(after);
  });

  it('should set player pending on join.', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {
        2: {
          lineup: [{
            address: ADDR_EMPTY,
          }, {
            address: P2_ADDR,
          }],
        } },
    });

    // execute action
    const nextState = tableReducer(before, pendingToggle(tableAddr, 2, 0));

    // check state after execution
    const after = before.setIn([tableAddr, '2', 'lineup', 0, 'pending'], true);
    expect(nextState).toEqual(after);
  });

  it('should be able to remove pending state from player.', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {
        2: {
          lineup: [{
            address: ADDR_EMPTY,
            pending: true,
          }, {
            address: P2_ADDR,
          }],
        } },
    });

    // execute action
    const nextState = tableReducer(before, pendingToggle(tableAddr, 2, 0));

    // check state after execution
    const after = before.deleteIn([tableAddr, '2', 'lineup', 0, 'pending']);
    expect(nextState).toEqual(after);
  });
});
