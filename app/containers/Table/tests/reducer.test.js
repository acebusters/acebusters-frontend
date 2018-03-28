import BigNumber from 'bignumber.js';
import { fromJS, is } from 'immutable';
import { Receipt } from 'poker-helper';

import tableReducer from '../reducer';
import {
  updateReceived,
  setCards,
  setPending,
  dropPending,
  lineupReceived,
  reservationReceived,
  seatReserved,
  seatsReleased,
  addMessage,
  tableReceived,
  setExitHand,
} from '../actions';

import { babz } from '../../../utils/amountFormatter';

jest.mock('../../../services/blockies.js', () => ({
  createBlocky: () => 'blocky',
}));

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
  it('should set initial structure when table received first time', () => {
    const state = fromJS({});
    const nextState = tableReducer(state, tableReceived(tableAddr));
    expect(nextState.get(tableAddr)).toBeDefined();
    expect(nextState.getIn([tableAddr, 'reservation'])).toBeDefined();
  });

  it('should set exitHand for player', () => {
    const lineup = [{
      address: P1_ADDR,
    }, {
      address: P2_ADDR,
    }];

    const state = fromJS({
      [tableAddr]: {
        0: {
          lineup,
        } },
    });
    const nextState = tableReducer(state, setExitHand(tableAddr, 0, 0, 2));
    expect(nextState.getIn([tableAddr, '0', 'lineup', 0, 'exitHand'])).toBe(2);
  });

  it('should not override existing table state when table received', () => {
    const state = fromJS({
      [tableAddr]: {
        reservation: {},
        data: {},
      },
    });
    const nextState = tableReducer(state, tableReceived(tableAddr));
    expect(nextState.get(tableAddr)).toBe(state.get(tableAddr));
  });

  it('should add reservations to table data', () => {
    const reservation = {
      0: {
        signerAddr: P1_ADDR,
        amount: '10000',
      },
    };

    const state = fromJS({
      [tableAddr]: {
        reservation: {},
      },
    });

    const nextState = tableReducer(state, reservationReceived(tableAddr, reservation));
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'signerAddr'])).toEqual(P1_ADDR);
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'amount'])).toEqual('10000');
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'blocky'])).toEqual('blocky');
  });

  it('should add new seat reservation to table data', () => {
    const reservation = {
      pos: 0,
      tableAddr,
      signerAddr: P1_ADDR,
      amount: '10000',
    };

    const state = fromJS({
      [tableAddr]: {
        reservation: {},
      },
    });

    const nextState = tableReducer(state, seatReserved(tableAddr, reservation));
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'signerAddr'])).toEqual(P1_ADDR);
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'amount'])).toEqual('10000');
    expect(nextState.getIn([tableAddr, 'reservation', '0', 'blocky'])).toEqual('blocky');
  });

  it('should release reserved seats', () => {
    const releasedSeats = [
      {
        pos: '0',
      },
      {
        pos: 2,
      },
    ];

    const state = fromJS({
      [tableAddr]: {
        reservation: {
          0: {
            signerAddr: P1_ADDR,
            amount: '10000',
          },
          1: {
            signerAddr: P1_ADDR,
            amount: '10000',
          },
          2: {
            signerAddr: P1_ADDR,
            amount: '10000',
          },
        },
      },
    });

    const nextState = tableReducer(state, seatsReleased(tableAddr, releasedSeats));
    expect(nextState.getIn([tableAddr, 'reservation', '0'])).toEqual(undefined);
    expect(nextState.getIn([tableAddr, 'reservation', '1']).toJS()).toEqual({
      signerAddr: P1_ADDR,
      amount: '10000',
    });
    expect(nextState.getIn([tableAddr, 'reservation', '2'])).toEqual(undefined);
  });

  it('should select lastRoundMaxBet for turn', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
      last: new Receipt(tableAddr).bet(1, babz(50)).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new Receipt(tableAddr).bet(1, babz(50)).sign(P2_KEY),
    }];
    const before = fromJS({
      [tableAddr]: {
        0: {
          dealer: 0,
          lineup,
        } },
    });

    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      changed: 123,
      state: 'turn',
      flopMaxBet: 50,
      lineup,
    }));

    // check state after execution
    expect(nextState.getIn([tableAddr, '0', 'lastRoundMaxBet'])).toEqual(50);
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

    // check lineup after execution
    expect(is(nextState.getIn([tableAddr, '0', 'lineup']), fromJS(newLineup))).toEqual(true);
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
          lineup,
        } },
    });

    const newLineup = [{
      address: P1_ADDR,
      last: new Receipt(tableAddr).bet(1, babz(50)).sign(P1_KEY),
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

    // check lineup after execution
    expect(is(nextState.getIn([tableAddr, '0', 'lineup']), fromJS(newLineup))).toEqual(true);
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
        } },
    });

    const dist = 'ey123';
    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 0,
      changed: 20,
      lineup,
      distribution: dist,
    }));

    // check state after execution
    expect(nextState.getIn([tableAddr, '0', 'distribution'])).toEqual(dist);
  });

  it('should not reset lastRoundMaxBet if state did not change', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {
        1: {
          dealer: 1,
          changed: 123,
          state: 'flop',
          lastRoundMaxBet: 100,
        } },
    });
    const lineup = [{
      address: P1_ADDR,
    }, {
      address: P2_ADDR,
    }];
    // execute action
    const nextState = tableReducer(before, updateReceived(tableAddr, {
      handId: 1,
      dealer: 1,
      lineup,
      preMaxBet: 100,
      state: 'flop',
    }));
    expect(nextState.getIn([tableAddr, '1', 'lastRoundMaxBet'])).toEqual(100);
  });

  it('should add amount into lineup', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {},
    });

    const expectedResult = fromJS({
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
    });

    // execute action
    const nextState = tableReducer(before, lineupReceived(tableAddr, [
      new BigNumber(0),
      [P1_ADDR, P2_ADDR, P3_ADDR],
      [new BigNumber(3000), new BigNumber(3000), new BigNumber(2000)],
      [new BigNumber(0), new BigNumber(0), new BigNumber(0)],
    ], undefined, undefined, 0));
    expect(nextState).toEqual(expectedResult);

    const nextState2 = tableReducer(before, lineupReceived(tableAddr, [
      new BigNumber(0),
      [P1_ADDR, P2_ADDR, P3_ADDR],
      [new BigNumber(3000), new BigNumber(3000), new BigNumber(2000)],
      [new BigNumber(0), new BigNumber(0), new BigNumber(0)],
    ], undefined, undefined, 0));
    expect(nextState2).toEqual(expectedResult);
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

    expect(tableReducer(before, setPending(tableAddr, 2, 0)))
      .toEqual(before.setIn([tableAddr, '2', 'lineup', 0, 'pending'], fromJS({})));

    expect(tableReducer(before, setPending(tableAddr, 2, 0, { signerAddr: '0x00' })))
      .toEqual(before.setIn([tableAddr, '2', 'lineup', 0, 'pending'], fromJS({
        signerAddr: '0x00',
        blocky: 'blocky',
      })));
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
    const nextState = tableReducer(
      before,
      dropPending(tableAddr, 2, 0)
    );

    // check state after execution
    const after = before.deleteIn([tableAddr, '2', 'lineup', 0, 'pending']);
    expect(nextState).toEqual(after);
  });

  it('should add message', () => {
    // set up previous state
    const before = fromJS({
      [tableAddr]: {
        messages: [],
      },
    });

    const date = new Date();

    // execute action
    const nextState = tableReducer(before, addMessage('hello!', tableAddr, P1_ADDR, date));

    // check state after execution
    const after = before.updateIn([tableAddr, 'messages'], (list) => list.push({
      message: 'hello!',
      signer: P1_ADDR,
      created: date,
    }));
    expect(nextState).toEqual(after);
  });

  it('should not return old messages', () => {
    // set up previous state
    const lineup = [{
      address: P1_ADDR,
      last: new Receipt(tableAddr).bet(1, babz(50)).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new Receipt(tableAddr).bet(1, babz(50)).sign(P2_KEY),
    }];

    const now = Date.now();
    const min16ago = Date.now() - (60 * 16 * 1000);

    const before = fromJS({
      [tableAddr]: {
        messages: [],
      },
    });

    const firstMessage = tableReducer(before, addMessage('old!', tableAddr, P1_ADDR, min16ago));
    const secondMessage = tableReducer(firstMessage, addMessage('hello!', tableAddr, P1_ADDR, now));

    // execute action
    const nextState = tableReducer(secondMessage, updateReceived(tableAddr, {
      handId: 0,
      dealer: 0,
      changed: 123,
      state: 'turn',
      flopMaxBet: 50,
      lineup,
    }));

    // check state after execution
    expect(nextState.getIn([tableAddr, 'messages']).toJS()).toEqual([{
      message: 'hello!',
      signer: P1_ADDR,
      created: now,
    }]);
  });
});
