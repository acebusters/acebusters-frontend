/**
 * Created by helge on 26.01.17.
 */

import SagaTester from 'redux-saga-tester';
import { fromJS } from 'immutable';
import { PLAYER1, PLAYER2, PLAYER3, PLAYER4 } from './consts';
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
    expect(sagaTester.wasCalled('BET')).toEqual(true);
  });

  it('should return the sb amount when i am sb and its my turn', () => {

  });

  it('should return the bb amount when i am bb and its my turn', () => {

  });

  it('should pay 0 receipt when not sb or bb', () => {

  });

  it('should not dispatch dealing action for SB when global error', () => {

  });

  it('should not dispatch dealing action for BB when global error', () => {

  });

  it('should dispatch NEXT_HAND action when completed is true', () => {

  });
});

