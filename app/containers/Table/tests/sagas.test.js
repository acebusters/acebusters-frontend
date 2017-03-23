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

  it('should return the bb amount when i am bb and its my turn', () => {
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

  it('should pay 0 receipt when not sb or bb', () => {
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
    // console.log(sagaTester.getLatestCalledAction());
    expect(sagaTester.getLatestCalledAction().amount).toEqual(0);
  });

  it('should show on showtime', () => {
    const hand = {
      state: 'showdown',
      dealer: 0,
      lineup: [{
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new EWT(ABI.ABI_BET).bet(1, 5000).sign(PLAYER2.key),
      }, {
        address: PLAYER3.address,
        last: new EWT(ABI.ABI_BET).bet(1, 5000).sign(PLAYER3.key),
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

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner);
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    // console.log(sagaTester.getLatestCalledAction());
    expect(sagaTester.getLatestCalledAction().amount).toEqual(5000);
  });

  it('should not dispatch dealing action for BB when global error', () => {

  });

  it('should dispatch NEXT_HAND action when completed is true', () => {

  });
});

