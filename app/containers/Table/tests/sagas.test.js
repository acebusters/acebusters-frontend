/**
 * Created by helge on 26.01.17.
 */

import EWT from 'ethereum-web-token';
import SagaTester from 'redux-saga-tester';
import { fromJS } from 'immutable';
import { PLAYER1, PLAYER2, PLAYER3, PLAYER4, PLAYER_EMPTY } from './consts';
import { updateScanner } from '../sagas';


import {
  updateReceived,
  UPDATE_RECEIVED,
  BET,
  SHOW,
  NET,
} from '../actions';

import { ABI_BET, ABI_SHOW } from '../../../app.config';

const tableAddr = '0x112233';

describe('Saga Tests', () => {
  it('should disptach sb action when i am sb', () => {
    const hand = {
      state: 'waiting',
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

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table: {
        [tableAddr]: { data: { smallBlind: 500 } },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(BET);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(500);
    expect(sagaTester.getCalledActions().length).toEqual(2);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should dispatch bet action with bb amount', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI_BET).bet(1, 500).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
      }, {
        address: PLAYER4.address,
      }],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER3.key,
      },
      table: {
        [tableAddr]: { data: { smallBlind: 500 } },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(BET);
    expect(sagaTester.getCalledActions().length).toEqual(2);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(1000);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should dispatch show action when its showtime!', () => {
    const hand = {
      handId: 3,
      state: 'showdown',
      dealer: 0,
      lineup: [{
      }, {
        address: PLAYER1.address,
        last: new EWT(ABI_SHOW).show(1, 1000).sign(PLAYER1.key),
      }, {
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI_BET).bet(1, 1000).sign(PLAYER2.key),
      }],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table: {
        [tableAddr]: {
          3: {
            holeCards: [12, 13],
          },
        },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(SHOW);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(1000);
    expect(sagaTester.getLatestCalledAction().holeCards).toEqual([12, 13]);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should dispatch net action when there is a netting request', () => {
    const hand = {
      handId: 3,
      state: 'flop',
      dealer: 0,
      netting: {
        newBalances: '0x1234',
        [PLAYER1.address]: '0x',
      },
      lineup: [],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(NET);
    expect(sagaTester.getLatestCalledAction().balances).toEqual('0x1234');
    expect(sagaTester.getLatestCalledAction().handId).toEqual(3);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should not dispatch netting when already signed', () => {
    const hand = {
      handId: 3,
      state: 'flop',
      dealer: 0,
      netting: {
        newBalances: '0x1234',
        [PLAYER2.address]: '0x',
      },
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getCalledActions().length).toEqual(1);
  });
});

