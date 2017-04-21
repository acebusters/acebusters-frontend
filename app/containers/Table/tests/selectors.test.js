import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  tableStateSelector,
  makeMissingHandSelector,
  makeSelectWinners,
  makeMyHandValueSelector,
  makeSitoutAmountSelector,
} from '../selectors';

import { PLAYER1, PLAYER2, PLAYER3, PLAYER4, PLAYER_EMPTY } from './consts';

import { ABI_FOLD, ABI_BET, ABI_SHOW } from '../../../app.config';


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
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER_EMPTY,
            }, {
              address: PLAYER1.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER1.key),
              cards: [21, 32],
            }, {
              address: PLAYER2.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER2.key),
              cards: [36, 49],
            }],
            cards: [8, 23, 10],
            state: 'showdown',
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
        addr: PLAYER2.address,
        hand: "Four of a Kind, Q's",
        amount: 2000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winner);
  });

  it('should have 2 winners with index 0 and 1 with a pair of Aces.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER1.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER1.key),
              cards: [25, 38],
            }, {
              address: PLAYER3.address,
              last: new EWT(ABI_BET).bet(1, 500).sign(PLAYER3.key),
            }, {
              address: PLAYER_EMPTY,
            }, {
              address: PLAYER2.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER2.key),
              cards: [12, 51],
            }],
            cards: [8, 9, 10],
            state: 'showdown',
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
        addr: PLAYER1.address,
        hand: "Pair, A's",
        amount: 1250,
      },
      {
        addr: PLAYER2.address,
        hand: "Pair, A's",
        amount: 1250,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });


  it('should have 1 winner with A high and top kicker.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER1.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER1.key),
              cards: [38, 37],
            }, {
              address: PLAYER2.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER2.key),
              cards: [25, 6],
            }],
            cards: [2, 3, 8],
            state: 'showdown',
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
        addr: PLAYER1.address,
        hand: 'A High',
        amount: 2000,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });

  it('should have 3 winners with 2 pair.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER1.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER1.key),
              cards: [35, 36],
            }, {
              address: PLAYER2.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER2.key),
              cards: [22, 23],
            }, {
              address: PLAYER3.address,
              last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER3.key),
              cards: [48, 49],
            }, {
              address: PLAYER4.address,
            }],
            cards: [8, 9, 10],
            state: 'showdown',
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
        addr: PLAYER1.address,
        hand: "Two Pair, Q's & J's",
        amount: 1000,
      },
      {
        addr: PLAYER2.address,
        hand: "Two Pair, Q's & J's",
        amount: 1000,
      },
      {
        addr: PLAYER3.address,
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
            state: 'showdown',
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

  it('should have winner before showdown.', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER2.address,
              last: new EWT(ABI_FOLD).fold(1, 800).sign(PLAYER2.key),
            }, {
              address: PLAYER1.address,
              last: new EWT(ABI_BET).bet(1, 1200).sign(PLAYER1.key),
            }, {
              address: PLAYER3.address,
              last: new EWT(ABI_FOLD).fold(1, 800).sign(PLAYER3.key),
            }, {
              address: PLAYER4.address,
              last: new EWT(ABI_FOLD).fold(1, 800).sign(PLAYER4.key),
            }, {
              address: PLAYER_EMPTY.address,
            }],
            holeCards: [11, 12],
            cards: [8, 9, 10],
            dealer: 0,
            state: 'turn',
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
        addr: PLAYER1.address,
        amount: 3600,
      }];
    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(winners);
  });

  it('should return empty when hand is not complete', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          2: {
            lineup: [{
              address: PLAYER2.address,
              last: new EWT(ABI_BET).bet(1, 1200).sign(PLAYER2.key),
            }, {
              address: PLAYER1.address,
              last: new EWT(ABI_BET).bet(1, 1200).sign(PLAYER1.key),
            }, {
              address: PLAYER4.address,
              last: new EWT(ABI_FOLD).fold(1, 800).sign(PLAYER1.key),
            }, {
              address: PLAYER_EMPTY.address,
            }],
            holeCards: [11, 12],
            dealer: 0,
            cards: [8, 9, 10],
            state: 'turn',
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

    const selectWinners = makeSelectWinners();
    expect(selectWinners(mockedState, props)).toEqual(null);
  });
});


describe('sitout Selector', () => {
  it('should select 1 to comeback from sitout.', () => {
    const mockedState = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'flop',
            lineup: [{
              address: PLAYER1.address,
              sitout: 1,
            }, {
              address: PLAYER2.address,
              sitout: 1,
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
    expect(selectSitoutAmount(mockedState, props)).toEqual(1);
  });

  it('should return 0 when state is waiting when i am in sitout.', () => {
    const mockedState = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'waiting',
            lineup: [{
              address: PLAYER1.address,
              sitout: 1,
            }, {
              address: PLAYER2.address,
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

  it('should return 0 when state is waiting when i am active.', () => {
    const mockedState = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'waiting',
            lineup: [{
              address: PLAYER1.address,
            }, {
              address: PLAYER2.address,
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

  it('should return myMaxBet  when i am not sitout.', () => {
    const mockedState = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table: {
        [TBL_ADDR]: {
          data: {
            smallBlind: 50,
          },
          2: {
            state: 'dealing',
            lineup: [{
              address: PLAYER1.address,
              last: new EWT(ABI_BET).bet(1, 100).sign(PLAYER1.key),
            }, {
              address: PLAYER2.address,
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
});
