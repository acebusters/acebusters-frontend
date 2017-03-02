
import EWT from 'ethereum-web-token';
import { Map, List } from 'immutable';
import tableReducer from '../reducer';
import * as TableActions from '../actions';

const BigNumber = require('bignumber.js');

const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_FOLD = [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_SHOW = [{ name: 'show', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_DIST = [{ name: 'distribution', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }, { type: 'bytes32[]' }] }];

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

// secretSeed: 'stadium today then top toward crack faint similar mosquito hunt thing sibling'
const P3_ADDR = '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc';
// const P3_KEY = '0x33de976dfb8bdf2dc3115801e514b902c4c913c351b6549947758a8b9d981722';

// Expecting a structure of the state like this:

  // [tableAddr]: {
  //   handId: 0,
  //   cards: [],
  //   dealer: 0,
  //   distribution: '',
  //   lineup: [],
  //   state: '',
  //   amounts: [],
  //   holeCards: [],
  //   lastRoundMaxBet: 0,
  // }
  //

describe('table reducer tests', () => {
  it('should recalculate lastRoundMaxBet if state changed', () => {
    const lineup = [{
      address: P1_ADDR,
      last: new EWT(ABI_BET).bet(1, 50).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new EWT(ABI_BET).bet(1, 50).sign(P2_KEY),
    }];
    const before = Map({
      '0x1234': Map({
        handId: 0,
        dealer: 0,
        state: 'flop',
        lineup: List([Map(lineup[0]), Map(lineup[1])]),
      }),
    });
    const after = before
      .setIn(['0x1234', 'state'], 'turn')
      .setIn(['0x1234', 'lastRoundMaxBet'], 50);
    expect(tableReducer(before, {
      type: TableActions.UPDATE_RECEIVED,
      tableAddr: '0x1234',
      tableState: {
        handId: 0,
        dealer: 0,
        state: 'turn',
        lineup,
      },
    })).toEqual(after);
  });

  it('should not recalculate lastRoundMaxBet if state did not change', () => {
    const bet1 = new EWT(ABI_BET).bet(1, 100).sign(P1_KEY);
    const before = Map({
      '0x1234': Map({
        handId: 1,
        dealer: 1,
        state: 'flop',
        lineup: List([Map({
          address: P1_ADDR,
          last: bet1,
        }), Map({
          address: P2_ADDR,
          last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
        })]),
        lastRoundMaxBet: 100,
      }),
    });

    const newBet = new EWT(ABI_BET).bet(1, 150).sign(P2_KEY);
    const after = before.setIn(['0x1234', 'lineup', 1, 'last'], newBet);
    expect(tableReducer(before, {
      type: TableActions.UPDATE_RECEIVED,
      tableAddr: '0x1234',
      tableState: {
        handId: 1,
        dealer: 1,
        state: 'flop',
        lineup: [{
          address: P1_ADDR,
          last: bet1,
        }, {
          address: P2_ADDR,
          last: newBet,
        }],
      },
    })).toEqual(after);
  });

  it('should add amount into lineup', () => {
    const before = Map({
      '0x1234': Map({
      }),
    });
    expect(tableReducer(before, {
      type: TableActions.LINEUP_RECEIVED,
      tableAddr: '0x1234',
      lineup: [
        new BigNumber(0),
        [P1_ADDR, P2_ADDR, P3_ADDR],
        [new BigNumber(3000), new BigNumber(3000), new BigNumber(2000)],
        [new BigNumber(0), new BigNumber(0), new BigNumber(0)],
      ],
    })).toEqual(Map({
      '0x1234': Map({
        lineup: List([Map({
          address: P1_ADDR,
        }), Map({
          address: P2_ADDR,
        }), Map({
          address: P3_ADDR,
        })]),
        amounts: List([3000, 3000, 2000]),
        lastHandNettedOnClient: 0,
      }),
    }));
  });

  it('should calculate stack for one hand', () => {
    const dists = [];
    dists.push(EWT.concat(P3_ADDR, 10).toString('hex')); // rake
    dists.push(EWT.concat(P1_ADDR, 100).toString('hex'));
    const before = Map({
      '0x1234': Map({
        lineup: List([Map({
          address: P1_ADDR,
        }), Map({
          address: P2_ADDR,
        })]),
        amounts: List([3000, 3000]),
        state: 'turn',
        lastHandNettedOnClient: 0,
      }),
    });
    const after = before
      .setIn(['0x1234', 'amounts', 0], 3050)
      .setIn(['0x1234', 'amounts', 1], 2950)
      .setIn(['0x1234', 'lastHandNettedOnClient'], 1);
    expect(tableReducer(before, {
      type: TableActions.COMPLETE_HAND_QUERY,
      tableAddr: '0x1234',
      hand: {
        handId: 1,
        lineup: [{
          address: P1_ADDR,
          last: new EWT(ABI_BET).bet(1, 50).sign(P1_KEY),
        }, {
          address: P2_ADDR,
          last: new EWT(ABI_BET).bet(1, 50).sign(P2_KEY),
        }],
        distribution: new EWT(ABI_DIST).distribution(1, 0, dists).sign(P1_KEY),
      },
    })).toEqual(after);
  });

  it('should add holeCards at right position into lineup', () => {
    expect(tableReducer(Map({
      hand: {
        lineup: [{
          address: P1_ADDR,
        }, {
          address: P2_ADDR,
        }],
      },
    }), {
      type: TableActions.COMPLETE_BET,
      holeCards: {
        cards: [2, 3],
      },
      privKey: P1_KEY,
    })).toEqual(Map({
      hand: {
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
        }, {
          address: P2_ADDR,
        }],
      },
    }));
  });

  it('should not overwrite holecards', () => {
    const lineup = [{
      address: P1_ADDR,
      last: new EWT(ABI_BET).bet(1, 100).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
    }];
    expect(tableReducer(Map({
      hand: {
        cards: [],
        handId: 1,
        dealer: 1,
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
        }, {
          address: P2_ADDR,
        }],
        state: 'flop',
      },
      lastRoundMaxBet: 100,
    }), {
      type: TableActions.UPDATE_RECEIVED,
      tableState: {
        handId: 1,
        dealer: 1,
        lineup,
        state: 'flop',
      },
    })).toEqual(Map({
      hand: {
        cards: [],
        handId: 1,
        dealer: 1,
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
          last: new EWT(ABI_BET).bet(1, 100).sign(P1_KEY),
        }, {
          address: P2_ADDR,
          last: new EWT(ABI_BET).bet(1, 100).sign(P2_KEY),
        }],
        state: 'flop',
      },
      lastRoundMaxBet: 100,
      complete: false,
    }));
  });

  it('should update stack sizes when hand complete', () => {
    const lineup = [{
      address: P1_ADDR,
      last: new EWT(ABI_SHOW).show(1, 100).sign(P1_KEY),
    }, {
      address: P2_ADDR,
      last: new EWT(ABI_FOLD).fold(1, 100).sign(P2_KEY),
    }];
    expect(tableReducer(Map({
      hand: {
        handId: 1,
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
        }, {
          address: P2_ADDR,
        }],
        state: 'showdown',
      },
      lastRoundMaxBet: 100,
    }), {
      type: TableActions.UPDATE_RECEIVED,
      tableState: {
        handId: 1,
        lineup,
        state: 'showdown',
      },
    })).toEqual(Map({
      hand: {
        handId: 2,
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
        }, {
          address: P2_ADDR,
        }],
        state: 'showdown',
      },
      lastRoundMaxBet: 0,
      complete: true,
    }));
  });

  it('should handle next hand', () => {
    expect(tableReducer(Map({
      hand: {
        dealer: 1,
        state: 'showdown',
        lineup: [{
          address: P1_ADDR,
          cards: [2, 3],
        }, {
          address: P2_ADDR,
        }],
      },
      lastRoundMaxBet: 0,
      complete: true,
      performedDealing: true,
    }), {
      type: TableActions.NEXT_HAND,
    })).toEqual(Map({
      hand: {
        cards: [],
        dealer: 2,
        state: 'dealing',
        lineup: [{
          address: P1_ADDR,
        }, {
          address: P2_ADDR,
        }],
      },
      lastRoundMaxBet: 0,
      complete: false,
      performedDealing: false,
    }));
  });
});
