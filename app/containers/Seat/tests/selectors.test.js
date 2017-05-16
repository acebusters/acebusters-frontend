import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  makeLastReceiptSelector,
  makeFoldedSelector,
  makeLastAmountSelector,
  makeCardsSelector,
  makeStackSelector,
} from '../selectors';

import { ABI_BET, ABI_DIST, ABI_FOLD } from '../../../app.config';

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

const TBL_ADDR = '0x77aabb1133';

describe('lastReceiptSelector', () => {
  it('should select correct last action', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_FOLD).fold(1, 500).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const receiptSelector = makeLastReceiptSelector();
    expect(receiptSelector(mockedState, props)).toEqual(EWT.parse(new EWT(ABI_FOLD).fold(1, 500).sign(P2_KEY)));
  });
});

describe('lastAmountSelector', () => {
  it('should calcluate correct last amount with maxbet', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 1500).sign(P2_KEY),
            }],
            lastRoundMaxBet: 1000,
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const lastAmountSelector = makeLastAmountSelector();
    expect(lastAmountSelector(mockedState, props)).toEqual(500);
  });
});

describe('foldedSelector', () => {
  it('should return true for folded pos', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_FOLD).fold(1, 500).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const foldedSelector = makeFoldedSelector();
    expect(foldedSelector(mockedState, props)).toEqual(true);
  });
});

describe('cardSelector', () => {
  it('it should return my holecards for my position', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
            holeCards: [15, 25],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const cardSelector = makeCardsSelector();
    expect(cardSelector(mockedState, props)).toEqual([15, 25]);
  });

  it('it should return other guys cards if not my pos and he has cards', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
              last: 'eyJ0eXBlIjoiRVdUIiwiYWxnIjoiRVMyNTZrIn0.eyJzaXRPdXQiOlt7InVpbnQiOjIxfSx7InVpbnQiOjEwMH1dLCJ2IjoxfQ.Tk6rY4rOwb6qrKsU6fTe3DmH_TqDtWKiVDlNutwzCqkbQ22jnMP8qUBcrhL5Eh9vT1SIVAYWXT6gJPnBEDqWPQ',
            }, {
              address: P2_ADDR,
              last: 'eyJ0eXBlIjoiRVdUIiwiYWxnIjoiRVMyNTZrIn0.eyJiZXQiOlt7InVpbnQiOjIxfSx7InVpbnQiOjB9XSwidiI6MH0.JdL0EshJbVv9TO-oKqhYkOJcjSb4rTeFpwfAK3G_M9BkdWBYdIeAyDqJwhddJdId-7S5oJRkX9tg1AuLnXfnfA',
              cards: [12, 21],
            }],
            holeCards: [15, 25],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const cardSelector = makeCardsSelector();
    expect(cardSelector(mockedState, props)).toEqual([12, 21]);
  });

  it('it should not return cards if not my pos and no cards are in lineup', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
              last: 'eyJ0eXBlIjoiRVdUIiwiYWxnIjoiRVMyNTZrIn0.eyJzaXRPdXQiOlt7InVpbnQiOjIxfSx7InVpbnQiOjEwMH1dLCJ2IjoxfQ.Tk6rY4rOwb6qrKsU6fTe3DmH_TqDtWKiVDlNutwzCqkbQ22jnMP8qUBcrhL5Eh9vT1SIVAYWXT6gJPnBEDqWPQ',
            }, {
              address: P2_ADDR,
              last: 'eyJ0eXBlIjoiRVdUIiwiYWxnIjoiRVMyNTZrIn0.eyJiZXQiOlt7InVpbnQiOjIxfSx7InVpbnQiOjB9XSwidiI6MH0.JdL0EshJbVv9TO-oKqhYkOJcjSb4rTeFpwfAK3G_M9BkdWBYdIeAyDqJwhddJdId-7S5oJRkX9tg1AuLnXfnfA',
            }],
            holeCards: [15, 25],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
        handId: 0,
      },
    };
    const cardSelector = makeCardsSelector();
    expect(cardSelector(mockedState, props)).toEqual([-1, -1]);
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
