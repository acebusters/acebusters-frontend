/**
 * Created by helge on 26.01.17.
 */

import EWT from 'ethereum-web-token';
import SagaTester from 'redux-saga-tester';
import { fromJS } from 'immutable';
import { PLAYER1, PLAYER2, PLAYER3, PLAYER4, ABI, PLAYER_EMPTY } from './consts';
import { updateScanner } from '../sagas';


import {
  updateReceived,
} from '../actions';

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

    let table = fromJS({
      hand,
    });

    table = table.set(tableAddr, fromJS({ data: { smallBlind: 500 } }));

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table,
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().amount).toEqual(500);
  });

  it('should dispatch bet action with bb amount', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 500).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
      }, {
        address: PLAYER4.address,
      }],
    };

    let table = fromJS({
      hand,
    });

    table = table.set(tableAddr, fromJS({ data: { smallBlind: 500 } }));

    const initialState = fromJS({
      account: {
        privKey: PLAYER3.key,
      },
      table,
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().amount).toEqual(1000);
  });

  it('should dispatch show action when its showtime!', () => {
    const hand = {
      state: 'dealing',
      dealer: 0,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 500).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 1000).sign(PLAYER3.key),
      }, {
        address: PLAYER4.address,
      }],
    };

    const table = fromJS({
      hand,
    });

    const initialState = fromJS({
      account: {
        privKey: PLAYER4.key,
      },
      table,
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().amount).toEqual(0);
  });

  it('should dispatch net action when there is a netting request', () => {
    const hand = {
      state: 'flop',
      dealer: 0,
      netting: {},
      lineup: [{
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 0).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 0).sign(PLAYER3.key),
      }, {
        address: PLAYER_EMPTY.address,
      }],
    };

    const table = fromJS({
      hand,
    });

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table,
    });

    // max bet 0 not optimal -> find out out how to set props for testing
    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual('acebusters/Table/NET');
  });
});

