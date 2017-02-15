/**
 * Created by helge on 26.01.17.
 */

import EWT from 'ethereum-web-token';
import { fromJS, Map } from 'immutable';
import { PLAYER1, PLAYER2, PLAYER3, PLAYER4, ABI } from './consts';
import { dispatchDealingAction, watchAndGet } from '../sagas';

describe('Saga Tests', () => {
  it('should return falsy when its sb turn and i am not sb', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
      }, {
        address: PLAYER3.address,
      }, {
        address: PLAYER4.address,
      }],
    };

    const table = Map({
      hand,
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value).toBeFalsy();
  });

  it('should return the sb amount when i am sb and its my turn', () => {
    const hand = {
      state: 'dealing',
      dealer: 2,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 0).sign(PLAYER3.key),
      }],
    };

    const table = Map({
      hand,
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value.PUT.action.amount).toBe(50000);
  });

  it('should return the bb amount when i am bb and its my turn', () => {
    const hand = {
      state: 'dealing',
      dealer: 1,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 50).sign(PLAYER3.key),
      }],
    };

    const table = Map({
      hand,
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value.PUT.action.amount).toBe(100000);
  });

  it('should pay 0 receipt when not sb or bb', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 50).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 100).sign(PLAYER3.key),
      }],
    };

    const table = Map({
      hand,
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    state.setIn(['table', 'hand'], hand);
    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value.PUT.action.amount).toBe(0);
  });

  it('should not dispatch dealing action for SB when global error', () => {
    const hand = {
      state: 'dealing',
      dealer: 2,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
      }, {
        address: PLAYER3.address,
      }],
    };

    const table = Map({
      hand,
      error: 'error',
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value).toBeFalsy();
  });

  it('should not dispatch dealing action for BB when global error', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 50).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
      }],
    };

    const table = Map({
      hand,
      error: 'error',
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen = dispatchDealingAction();
    gen.next(state);
    expect(gen.next(state).value).toBeFalsy();
  });

  it('should dispatch NEXT_HAND action when completed is true', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 50).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
      }],
    };

    const table = Map({
      hand,
      complete: true,
    });

    const state = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table,
    });

    const gen1 = watchAndGet();
    gen1.next(state);
    gen1.next();
    expect(gen1.next(state).value.FORK).toBeDefined();
  });
});

