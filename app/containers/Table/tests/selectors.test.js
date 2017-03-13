import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  tableStateSelector,
  makeStackSelector,
  actionSelector,
} from '../selectors';

const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_DIST = [{ name: 'distribution', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }, { type: 'bytes32[]' }] }];

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

const TBL_ADDR = '0x77aabb1133';
const PROPS = {
  params: {
    tableAddr: TBL_ADDR,
  },
};

describe('tableStateSelector', () => {
  it('should select the table state', () => {
    const tableState = fromJS({
      data: {},
    });
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: tableState,
      },
    });
    expect(tableStateSelector(mockedState, PROPS)).toEqual(tableState);
  });
});

describe('stackSelector', () => {
  it('should select player\'s stack with empty state channel.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
            amounts: [3000, 5000],
            lastHandNetted: 3,
          },
        },
      },
    });
    const stackSelector = makeStackSelector();
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    expect(stackSelector(mockedState, props)).toEqual(3000);
  });

  it('should select player\'s stack with 1 hand in state channel.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 500).sign(P1_KEY),
            }, {
              address: P2_ADDR,
            }],
          },
          data: {
            seats: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
            amounts: [3000, 5000],
            lastHandNetted: 3,
          },
        },
      },
    });
    const stackSelector = makeStackSelector();
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    expect(stackSelector(mockedState, props)).toEqual(2500);
  });

  it('should select player\'s stack with 2 hand in state channel.', () => {
    const dists = [];
    dists.push(EWT.concat(P1_ADDR, 10).toString('hex')); // rake
    dists.push(EWT.concat(P2_ADDR, 1000).toString('hex'));
    const distRec = new EWT(ABI_DIST).distribution(4, 0, dists).sign(P1_KEY);

    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'showdown',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 500).sign(P2_KEY),
            }],
            distribution: distRec,
          },
          5: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 1200).sign(P2_KEY),
            }],
          },
          data: {
            seats: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
            amounts: [3000, 5000],
            lastHandNetted: 3,
          },
        },
      },
    });
    const stackSelector = makeStackSelector();
    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    expect(stackSelector(mockedState, props)).toEqual(4300);
  });
});

describe('actionSelector', () => {
  it('should select action', () => {
    const action = fromJS({
      state: 'waiting',
      dealer: 0,
      lineup: [{
        address: P1_ADDR,
      }, {
        address: P2_ADDR,
      }],
    });
    expect(actionSelector(action, 1)).toEqual({ address: P2_ADDR });
  });
});
