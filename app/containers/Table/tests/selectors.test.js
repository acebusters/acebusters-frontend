import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  tableStateSelector,
  makeMissingHandSelector,
  makeSelectWinners,
  makeMyHandValueSelector,
  makeSitoutAmountSelector,
} from '../selectors';

import { ABI_DIST, ABI_BET } from '../../../app.config';

const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

const P3_ADDR = '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc';

const P4_ADDR = '0x0dfbfdf730c7d3612cf605e6629be369aa4eceeb';

const P_EMPTY = '0x0000000000000000000000000000000000000000';

const ORACLE_ADDR = '0x82e8c6cf42c8d1ff9594b17a3f50e94a12cc860f';
const ORACLE_KEY = '0x94890218f2b0d04296f30aeafd13655eba4c5bbf1770273276fee52cbe3f2cb4';


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

describe('missingHandSelector', () => {
  it('should select missing hands.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          5: {},
          data: {
            lastHandNetted: 3,
          },
        },
      },
    });
    const missingHandSelector = makeMissingHandSelector();
    expect(missingHandSelector(mockedState, PROPS)).toEqual([4]);
  });

  it('should return empty array if no hand missing.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          4: {},
          5: {},
          data: {
            lastHandNetted: 3,
          },
        },
      },
    });
    const missingHandSelector = makeMissingHandSelector();
    expect(missingHandSelector(mockedState, PROPS)).toEqual([]);
  });

  it('should return lastHandNetted + 1 if no hand available.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
            lastHandNetted: 3,
          },
        },
      },
    });
    const missingHandSelector = makeMissingHandSelector();
    expect(missingHandSelector(mockedState, PROPS)).toEqual([4]);
  });
});

describe('winnersSelector', () => {
  it('should have winner with index 0 with a pair of Aces`.', () => {
    const distRec = new EWT(ABI_DIST).distribution(2, 0, [
      EWT.concat(P2_ADDR, 1000).toString('hex'),
      EWT.concat(ORACLE_ADDR, 10).toString('hex'),
    ]).sign(ORACLE_KEY);
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: P_EMPTY,
            }, {
              address: P1_ADDR,
              cards: [21, 32],
            }, {
              address: P2_ADDR,
              cards: [36, 49],
            }],
            cards: [8, 23, 10],
            distribution: distRec,
          },
        },
      },
    });
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };
    const winner = [
      {
        addr: P2_ADDR,
        hand: "Four of a Kind, Q's",
        amount: 1000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winner);
  });

  it('should have 2 winners with index 0 and 1 with a pair of Aces.', () => {
    const distRec = new EWT(ABI_DIST).distribution(2, 0, [
      EWT.concat(P1_ADDR, 1000).toString('hex'),
      EWT.concat(P2_ADDR, 1000).toString('hex'),
      EWT.concat(ORACLE_ADDR, 10).toString('hex'), // rake
    ]).sign(ORACLE_KEY);

    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: P1_ADDR,
              cards: [25, 38],
            }, {
              address: P3_ADDR,
            }, {
              address: P_EMPTY,
            }, {
              address: P2_ADDR,
              cards: [12, 51],
            }],
            cards: [8, 9, 10],
            distribution: distRec,
          },
        },
      },
    });
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };

    const winners = [
      {
        addr: P1_ADDR,
        hand: "Pair, A's",
        amount: 1000,
      },
      {
        addr: P2_ADDR,
        hand: "Pair, A's",
        amount: 1000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });


  it('should have 1 winner with A high and top kicker.', () => {
    const distRec = new EWT(ABI_DIST).distribution(2, 0, [
      EWT.concat(P1_ADDR, 1000).toString('hex'),
      EWT.concat(ORACLE_ADDR, 10).toString('hex'),
    ]).sign(ORACLE_KEY);
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: P1_ADDR,
              cards: [38, 37],
            }, {
              address: P2_ADDR,
              cards: [25, 6],
            }],
            cards: [2, 3, 8],
            distribution: distRec,
          },
        },
      },
    });
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };

    const winners = [
      {
        addr: P1_ADDR,
        hand: 'A High',
        amount: 1000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });

  it('should have 3 winners with 2 pair.', () => {
    const distRec = new EWT(ABI_DIST).distribution(2, 0, [
      EWT.concat(P1_ADDR, 1000).toString('hex'),
      EWT.concat(P2_ADDR, 1000).toString('hex'),
      EWT.concat(P3_ADDR, 1000).toString('hex'),
    ]).sign(ORACLE_KEY);
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: P1_ADDR,
              cards: [35, 36],
            }, {
              address: P2_ADDR,
              cards: [22, 23],
            }, {
              address: P3_ADDR,
              cards: [48, 49],
            }, {
              address: P4_ADDR,
            }],
            cards: [8, 9, 10],
            distribution: distRec,
          },
        },
      },
    });
    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };

    const winners = [
      {
        addr: P1_ADDR,
        hand: "Two Pair, Q's & J's",
        amount: 1000,
      },
      {
        addr: P2_ADDR,
        hand: "Two Pair, Q's & J's",
        amount: 1000,
      },
      {
        addr: P3_ADDR,
        hand: "Two Pair, Q's & J's",
        amount: 1000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });

  it('should have winner with index 0 with a pair of Aces`.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            holeCards: [11, 12],
            cards: [8, 9, 10],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };
    const selectHandValue = makeMyHandValueSelector();
    expect(selectHandValue(mockedState, props).descr).toEqual('Royal Flush');
  });
});


describe('sitout Selector', () => {
  it('should select BB to comeback from sitout`.', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
              sitout: 1,
            }, {
              address: P2_ADDR,
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      myMaxBet: 0,
      myPos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };
    const selectSitoutAmount = makeSitoutAmountSelector();
    expect(selectSitoutAmount(mockedState, props)).toEqual(100);
  });

  it('should return 0 when state is waiting and i am not in sitout.', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      myMaxBet: 0,
      myPos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };
    const selectSitoutAmount = makeSitoutAmountSelector();
    expect(selectSitoutAmount(mockedState, props)).toEqual(0);
  });

  it('should return myMaxBet + 1 when i am not sitout not in waiting.', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 200).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 200).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      myMaxBet: 0,
      myPos: 0,
      params: {
        tableAddr: TBL_ADDR,
        handId: 2,
      },
    };
    const selectSitoutAmount = makeSitoutAmountSelector();
    expect(selectSitoutAmount(mockedState, props)).toEqual(201);
  });
});
