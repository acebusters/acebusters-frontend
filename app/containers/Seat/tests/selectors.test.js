import { fromJS } from 'immutable';
import { Type, Receipt } from 'poker-helper';

import { babz } from '../../../utils/amountFormatter';

import {
  makeLastReceiptSelector,
  makeFoldedSelector,
  makeLastAmountSelector,
  makeCardsSelector,
  makeStackSelector,
  makeShowStatusSelector,
  makeSeatStatusSelector,
  makeLastActionSelector,
  makeOpenSelector,
  makeCoordsSelector,
  makeReservedSelector,
} from '../selectors';

import {
  STATUS_MSG,
} from '../../../app.config';

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';
const P1_KEY = '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca';

// secretSeed: 'engine bargain deny liberty girl wedding plug valley pig admit kiss couch'
const P2_ADDR = '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7';
const P2_KEY = '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729';
const EMPTY = '0x0000000000000000000000000000000000000000';

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
              last: new Receipt(TBL_ADDR).fold(1, babz(500)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const receiptSelector = makeLastReceiptSelector();
    expect(receiptSelector(mockedState, props)).toEqual(Receipt.parse(new Receipt(TBL_ADDR).fold(1, babz(500)).sign(P2_KEY)));
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
              last: new Receipt(TBL_ADDR).bet(1, babz(1500)).sign(P2_KEY),
            }],
            lastRoundMaxBet: babz(1000),
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const lastAmountSelector = makeLastAmountSelector();
    expect(lastAmountSelector(mockedState, props)).toEqual(500000000000000);
  });
});

describe('reservedSeatSelector', () => {
  it('should select reservation for the seat', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          reservation: {
            0: { signerAddr: '0x000' },
            1: { signerAddr: '0x001' },
            2: { signerAddr: '0x002' },
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    expect(makeReservedSelector()(mockedState, props)).toEqual({ signerAddr: '0x001' });
  });
});

describe('makeLastActionSelector', () => {
  it('should return type of last action', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          0: {
            state: 'flop',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(1, babz(1500)).sign(P2_KEY),
            }],
            lastRoundMaxBet: babz(1000),
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const lastActionSelector = makeLastActionSelector();
    expect(lastActionSelector(mockedState, props)).toEqual(Type.BET);
  });
});

describe('makeOpenSelector', () => {
  it('should return false if seat is busy', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: EMPTY,
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const openSelector = makeOpenSelector();
    expect(openSelector(mockedState, props)).toEqual(false);
  });

  it('should return true if seat is open', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: EMPTY,
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const openSelector = makeOpenSelector();
    expect(openSelector(mockedState, props)).toEqual(true);
  });
});

describe('makeCoordsSelector', () => {
  it('should return coords', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
            seats: [],
          },
          0: {
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
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const propsSecond = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const coordsSelector = makeCoordsSelector();
    expect(coordsSelector(mockedState, props)).toEqual([10, 40, 0]);
    expect(coordsSelector(mockedState, propsSecond)).toEqual([90, 40, 0]);
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
              last: new Receipt(TBL_ADDR).fold(1, babz(500)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
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
              last: new Receipt(TBL_ADDR).bet(21, babz(100)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(21, babz(0)).sign(P2_KEY),
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
              last: new Receipt(TBL_ADDR).bet(21, babz(100)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(21, babz(0)).sign(P2_KEY),
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
              last: new Receipt(TBL_ADDR).bet(1, babz(500)).sign(P1_KEY),
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
            amounts: [babz(3000).toNumber(), babz(5000).toNumber()],
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
    expect(stackSelector(mockedState, props)).toEqual(babz(2500).toNumber());
  });

  it('should select player\'s stack with 2 hand in state channel.', () => {
    const dists = [
      babz(10), // rake
      babz(1000),
    ];
    const distRec = new Receipt(TBL_ADDR).dist(4, 0, dists).sign(P1_KEY);

    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          4: {
            state: 'showdown',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(1, babz(500)).sign(P2_KEY),
            }],
            distribution: distRec,
          },
          5: {
            state: 'waiting',
            lineup: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(1, babz(1200)).sign(P2_KEY),
            }],
          },
          data: {
            seats: [{
              address: P1_ADDR,
            }, {
              address: P2_ADDR,
            }],
            amounts: [babz(3000).toNumber(), babz(5000).toNumber()],
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
    expect(stackSelector(mockedState, props)).toEqual(babz(4300).toNumber());
  });
});

describe('makeSeatStatusSelector', () => {
  describe('if user sits at table and seat is pending', () => {
    it('should return sittingIn', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            0: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
              lineup: [{
                address: P1_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(50)).sign(P1_KEY),
                pending: true,
              }, {
                address: P2_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(100)).sign(P2_KEY),
              }],
            },
          },
        },
      });

      const props = {
        pos: 0,
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.sittingIn);
    });
  });
  describe('if player is leaving the table', () => {
    it('should return standingUp', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            2: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
              lineup: [{
                address: P1_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(50)).sign(P1_KEY),
                exitHand: 0,
              }, {
                address: P2_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(100)).sign(P2_KEY),
              }],
            },
          },
        },
      });

      const props = {
        pos: 0,
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.standingUp);
    });
  });
  describe('if player is in sitout', () => {
    it('should return sitOut', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            0: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
              lineup: [{
                address: P1_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(50)).sign(P1_KEY),
                sitout: 312431432,
              }, {
                address: P2_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(100)).sign(P2_KEY),
              }],
            },
          },
        },
      });

      const props = {
        pos: 0,
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.sitOut);
    });
  });
  describe('if player returns from sitout', () => {
    it('should return sittingIn', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            1: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
              lineup: [{
                address: P1_ADDR,
                last: new Receipt(TBL_ADDR).sitOut(1, babz(0)).sign(P1_KEY),
              }, {
                address: P2_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(100)).sign(P2_KEY),
              }],
            },
          },
        },
      });

      const props = {
        pos: 0,
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.sittingIn);
    });
  });
  describe('if player is sitting at table playing', () => {
    it('should return sittingIn', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            1: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
              lineup: [{
                address: P1_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(50)).sign(P1_KEY),
              }, {
                address: P2_ADDR,
                last: new Receipt(TBL_ADDR).bet(1, babz(100)).sign(P2_KEY),
              }],
            },
          },
        },
      });

      const props = {
        pos: 0,
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.active);
    });
  });
  describe('if player waiting for another player', () => {
    it('should return waiting', () => {
      const mockedState = fromJS({
        table: {
          [TBL_ADDR]: {
            data: {
            },
            1: {
              sb: 50,
              state: 'preflop',
              dealer: 0,
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
        params: {
          tableAddr: TBL_ADDR,
        },
      };
      const statusSelector = makeSeatStatusSelector();
      expect(statusSelector(mockedState, props))
        .toEqual(STATUS_MSG.waiting);
    });
  });
});

describe('makeShowStatusSelector', () => {
  it('should return posted SB', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
          },
          0: {
            sb: babz(50).toNumber(),
            state: 'preflop',
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(0, babz(50)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(0, babz(100)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props))
      .toEqual(STATUS_MSG.blindSmall);
  });

  it('should return posted BB', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {},
          0: {
            sb: babz(50).toNumber(),
            state: 'preflop',
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(0, babz(50)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(0, babz(100)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props)).toEqual(STATUS_MSG.blindBig);
  });

  it('should return check', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
          },
          3: {
            sb: 50,
            state: 'flop',
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(200)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).checkFlop(3, babz(200)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 1,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props)).toEqual(STATUS_MSG.check);
  });

  it('should return call', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
          },
          3: {
            sb: 50,
            state: 'flop',
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(200)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(200)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props)).toEqual(STATUS_MSG.call);
  });

  it('should return bet', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
          },
          3: {
            sb: 50,
            state: 'flop',
            lastRoundMaxBet: babz(100),
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(200)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(100)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props)).toEqual(STATUS_MSG.bet);
  });

  it('should return raise', () => {
    const mockedState = fromJS({
      table: {
        [TBL_ADDR]: {
          data: {
          },
          3: {
            sb: 50,
            state: 'flop',
            lastRoundMaxBet: 100,
            dealer: 0,
            lineup: [{
              address: P1_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(400)).sign(P1_KEY),
            }, {
              address: P2_ADDR,
              last: new Receipt(TBL_ADDR).bet(3, babz(200)).sign(P2_KEY),
            }],
          },
        },
      },
    });

    const props = {
      pos: 0,
      params: {
        tableAddr: TBL_ADDR,
      },
    };
    const statusSelector = makeShowStatusSelector();
    expect(statusSelector(mockedState, props)).toEqual(STATUS_MSG.raise);
  });
});
