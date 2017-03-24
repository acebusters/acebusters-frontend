import { fromJS } from 'immutable';
import EWT from 'ethereum-web-token';

import {
  makeLastReceiptSelector,
  makeFoldedSelector,
} from '../selectors';

const ABI_FOLD = [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

// secretSeed: 'rural tent tests net drip fatigue uncle action repeat couple lawn rival'
const P1_ADDR = '0x6d2f2c0fa568243d2def3e999a791a6df45d816e';

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

