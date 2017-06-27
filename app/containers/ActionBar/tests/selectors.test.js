/**
 * Created by helge on 29.03.17.
 */

import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  makeMinSelector,
  makeAmountToCallSelector,
  makeSelectActionBarActive,
  makeSelectActionBarVisible,
  getActionBarMode,
  getActionBarSliderOpen,
  getActionBarTurnComplete,
  getActionBarButtonActive,
} from '../selectors';

import { checkABIs } from '../../../app.config';

const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';

const P3_ADDR = '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc';
const P3_KEY = '0x33de976dfb8bdf2dc3115801e514b902c4c913c351b6549947758a8b9d981722';

const TBL_ADDR = '0x77aabb1133';

const P_EMPTY = '0x0000000000000000000000000000000000000000';

describe('minSelector', () => {
  it('should return the difference between the 2 highes bettors', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'flop',
            lastRoundMaxBet: 1000,
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 3000).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(ABI_BET).bet(1, 7000).sign(P3_KEY),
            }],
          },
          data: {
            amounts: [30000, 50000, 20000],
            smallBlind: 500,
            lastHandNetted: 3,
          },
        },
      },
    });

    const minSelector = makeMinSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(minSelector(mockedState, props)).toEqual(10000);
  });

  it('should return 2 times the big blind preflop with no raise', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'preflop',
            lastRoundMaxBet: 0,
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 0).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 500).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P3_KEY),
            }],
          },
          data: {
            amounts: [30000, 50000, 20000],
            smallBlind: 500,
            lastHandNetted: 3,
          },
        },
      },
    });

    const minSelector = makeMinSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(minSelector(mockedState, props)).toEqual(2000);
  });

  it('should return BB when there was no bet or raise', () => {
    const mockedState = fromJS({
      account: {
        privKey: P3_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'flop',
            lastRoundMaxBet: 400,
            dealer: 0,
            lineup: [{
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 400).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(checkABIs.flop).checkFlop(1, 400).sign(P3_KEY),
            }],
          },
          data: {
            amounts: [30000, 50000, 20000],
            smallBlind: 50,
            lastHandNetted: 3,
          },
        },
      },
    });

    const minSelector = makeMinSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(minSelector(mockedState, props)).toEqual(100);
  });

  it('should return the stacksize when player does not have enough to bet min', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'flop',
            lastRoundMaxBet: 1000,
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 2000).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P3_KEY),
            }],
          },
          data: {
            amounts: [1421, 50000, 20000],
            smallBlind: 500,
            lastHandNetted: 3,
          },
        },
      },
    });

    const minSelector = makeMinSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(minSelector(mockedState, props)).toEqual(421);
  });
});

describe('amountToCall Selector', () => {
  it('should correct amount when my maxBet 0', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'preflop',
            lastRoundMaxBet: 0,
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 0).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 500).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P3_KEY),
            }, {
              address: P_EMPTY,
            }],
          },
          data: {
            smallBlind: 500,
            lastHandNetted: 3,
          },
        },
      },
    });

    const amountToCallSelector = makeAmountToCallSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(amountToCallSelector(mockedState, props)).toEqual(1000);
  });

  it('should return difference between maxBet and myMaxBet', () => {
    const mockedState = fromJS({
      account: {
        privKey: P1_KEY,
      },
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'preflop',
            lastRoundMaxBet: 1000,
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new EWT(ABI_BET).bet(1, 1000).sign(P2_KEY),
            }, {
              address: P3_ADDR,
              last: new EWT(ABI_BET).bet(1, 2500).sign(P3_KEY),
            }, {
              address: P_EMPTY,
            }],
          },
          data: {
            smallBlind: 500,
            lastHandNetted: 3,
          },
        },
      },
    });

    const amountToCallSelector = makeAmountToCallSelector();
    const props = {
      pos: 0,
      params: {
        handId: 4,
        tableAddr: TBL_ADDR,
      },
    };
    expect(amountToCallSelector(mockedState, props)).toEqual(1500);
  });
});

// action specific tests
describe('makeSelectActionBarActive', () => {
  const mockedState = fromJS({
    actionBar: { turnComplete: false },
    account: { privKey: P1_KEY },
    table: {
      [TBL_ADDR]: {
        4: {
          state: 'flop',
          lastRoundMaxBet: 1000,
          lineup: [{
            address: P1_ADDR,
            last: new EWT(ABI_BET).bet(1, 1000).sign(P1_KEY),
          }, {
            address: P2_ADDR,
            last: new EWT(ABI_BET).bet(1, 2000).sign(P2_KEY),
          }, {
            address: P3_ADDR,
            last: new EWT(ABI_BET).bet(1, 1000).sign(P3_KEY),
          }],
        },
        data: {
          amounts: [1421, 50000, 20000],
          smallBlind: 500,
          lastHandNetted: 3,
        },
      },
    },
  });
  const selector = makeSelectActionBarActive();
  const props = fromJS({
    pos: 2,
    isMyTurn: true,
    params: {
      handId: 4,
      tableAddr: TBL_ADDR,
    },
  });
  describe('if player\'s turn, correct handstate, !turnComplete', () => {
    it('should return true', () => {
      expect(selector(mockedState, props.toJS())).toBe(true);
    });
  });
  describe('if turnComplete', () => {
    it('should return false', () => {
      const turnComplete = mockedState.setIn(
        ['actionBar', 'turnComplete'],
        true,
      );
      expect(selector(turnComplete, props.toJS())).toBe(false);
    });
  });
  describe('if not appropriate handState', () => {
    it('should return false', () => {
      const handStateWaiting = mockedState.setIn(
        ['table', TBL_ADDR, '4', 'state'],
        'waiting',
      );
      expect(selector(handStateWaiting, props.toJS())).toBe(false);
      const handStateDealing = mockedState.setIn(
        ['table', TBL_ADDR, '4', 'state'],
        'dealing',
      );
      expect(selector(handStateDealing, props.toJS())).toBe(false);
      const handStateShowdown = mockedState.setIn(
        ['table', TBL_ADDR, '4', 'state'],
        'showdown',
      );
      expect(selector(handStateShowdown, props.toJS())).toBe(false);
    });
  });
  describe('if not player\'s turn', () => {
    it('should return false', () => {
      const newProps = props.set('isMyTurn', false);
      expect(selector(mockedState, newProps.toJS())).toBe(false);
    });
  });
});

describe('makeSelectActionBarVisible', () => {
  const mockedState = fromJS({
    actionBar: { turnComplete: false },
    account: { privKey: P1_KEY },
    table: {
      [TBL_ADDR]: {
        4: {
          state: 'flop',
          lastRoundMaxBet: 1000,
          lineup: [{
            address: P1_ADDR,
            last: new EWT(ABI_BET).bet(1, 1000).sign(P1_KEY),
          }, {
            address: P2_ADDR,
            last: new EWT(ABI_BET).bet(1, 2000).sign(P2_KEY),
          }, {
            address: P3_ADDR,
            last: new EWT(ABI_BET).bet(1, 1000).sign(P3_KEY),
          }],
        },
        data: {
          amounts: [1421, 50000, 20000],
          smallBlind: 500,
          lastHandNetted: 3,
        },
      },
    },
  });
  const selector = makeSelectActionBarVisible();
  const props = fromJS({
    pos: 2,
    myPos: 2,
    isMyTurn: true,
    params: {
      handId: 4,
      tableAddr: TBL_ADDR,
    },
  });
  describe('if typeof myPos is \'number\'', () => {
    it('should return true', () => {
      expect(selector(mockedState, props.toJS())).toBe(true);
    });
  });
  describe('if myPos is undefined', () => {
    it('should return false', () => {
      const newProps = props.set('myPos', undefined);
      expect(selector(mockedState, newProps.toJS())).toBe(false);
    });
  });
  describe('else should default', () => {
    it('should return false', () => {
      const newProps = props.set('myPos', 'a');
      expect(selector(mockedState, newProps.toJS())).toBe(false);
    });
  });
});

describe('misc actionBar state selectors', () => {
  const mockedState = fromJS({
    actionBar: {
      turnComplete: false,
      buttonActive: false,
      sliderOpen: true,
      mode: 'CALL',
    },
  });
  describe('getActionBarMode', () => {
    it('should return \'mode\'', () => {
      const selector = getActionBarMode();
      expect(selector(mockedState)).toBe('CALL');
    });
  });

  describe('getActionBarSliderOpen', () => {
    it('should return \'sliderOpen\'', () => {
      const selector = getActionBarSliderOpen();
      expect(selector(mockedState)).toBe(true);
    });
  });

  describe('getActionBarTurnComplete', () => {
    it('should return \'turnComplete\'', () => {
      const selector = getActionBarTurnComplete();
      expect(selector(mockedState)).toBe(false);
    });
  });

  describe('getActionBarButtonActive', () => {
    it('should return \'buttonActive\'', () => {
      const selector = getActionBarButtonActive();
      expect(selector(mockedState)).toBe(false);
    });
  });
});
