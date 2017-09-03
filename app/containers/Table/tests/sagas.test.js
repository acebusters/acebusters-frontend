/**
 * Created by helge on 26.01.17.
 */

import { Receipt, PokerHelper } from 'poker-helper';
import SagaTester from 'redux-saga-tester';
import { fromJS } from 'immutable';
import nock from 'nock';

import { PLAYER1, PLAYER2, PLAYER3, PLAYER4, PLAYER_EMPTY } from './consts';
import { updateScanner } from '../sagas/updateScannerSaga';
import { payFlow } from '../sagas/payFlowSaga';
import { formActionSaga } from '../../../services/reduxFormSaga';
import { babz } from '../../../utils/amountFormatter';
import {
  bet,
  pay,
  updateReceived,
  UPDATE_RECEIVED,
  ADD_MESSAGE,
  RECEIPT_SET,
  BET,
  SHOW,
  NET,
} from '../actions';

const tableAddr = '0x112233';

describe('Saga Tests', () => {
  it('should disptach sb action when i am sb', () => {
    const hand = {
      state: 'waiting',
      dealer: 0,
      sb: babz(50),
      handId: 1,
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
        [tableAddr]: { data: { smallBlind: babz(500) } },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(BET);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(babz(500));
    expect(sagaTester.getCalledActions().length).toEqual(2);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should disptach sb action when when player comes back from sitout', () => {
    const hand = {
      state: 'waiting',
      dealer: 0,
      handId: 1,
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).sitOut(1, babz(0)).sign(PLAYER2.key),
      }],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER1.key,
      },
      table: {
        [tableAddr]: { data: { smallBlind: babz(500) } },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(BET);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(babz(500));
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
      handId: 1,
      sb: babz(50),
      lineup: [{
        address: PLAYER1.address,
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).bet(1, babz(500)).sign(PLAYER2.key),
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
        [tableAddr]: { data: { smallBlind: babz(500) } },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(BET);
    expect(sagaTester.getCalledActions().length).toEqual(2);
    expect(sagaTester.getLatestCalledAction().amount).toEqual(babz(1000).toNumber());
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
      sb: babz(50),
      lineup: [{
        address: PLAYER1.address,
        last: new Receipt(tableAddr).show(1, babz(1000)).sign(PLAYER1.key),
      }, {
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER2.key),
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
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    const show = sagaTester.getLatestCalledAction();
    expect(show.type).toEqual(SHOW);
    expect(show.amount).toEqual(babz(1000).toNumber());
    expect(show.holeCards).toEqual([12, 13]);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should dispatch show action when its showtime as all-in player!', async () => {
    const hand = {
      handId: 4,
      state: 'showdown',
      dealer: 0,
      sb: babz(50),
      lineup: [{
        address: PLAYER1.address,
        last: new Receipt(tableAddr).show(1, babz(1000)).sign(PLAYER1.key),
      }, {
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER2.key),
        sitout: 'allin',
      }],
    };
    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table: {
        [tableAddr]: {
          4: {
            holeCards: [12, 13],
          },
        },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
    await sagaTester.dispatch(updateReceived(tableAddr, hand));
    const show = sagaTester.getLatestCalledAction();
    expect(show.type).toEqual(SHOW);
    expect(show.amount).toEqual(babz(1000).toNumber());
    expect(show.holeCards).toEqual([12, 13]);
    expect(sagaTester.getCalledActions().length).toEqual(2);
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
      lineup: [{
        address: PLAYER1.address,
        last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER1.key),
      }, {
        address: PLAYER_EMPTY.address,
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER2.key),
      }],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
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
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getCalledActions().length).toEqual(1);
  });

  it('should return cards when bet successful', async () => {
    // mock a successful request
    nock('http://ab.com', { filteringScope: () => true })
      .filteringPath(() => '/')
      .post('/')
      .reply(200, '{"cards":[12,13]}');

    const initialState = fromJS({
      table: {
        [tableAddr]: {
          data: {},
          3: {
            dealer: 0,
            state: 'flop',
            lineup: [{}, {}],
          },
        },
      },
    });
    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(formActionSaga);
    sagaTester.start(payFlow, new PokerHelper());
    const payAction = bet(tableAddr, 3, babz(500), PLAYER2.key, 1, 'prevReceipt');
    const rsp = await pay(payAction, (action) => sagaTester.dispatch(action));
    expect(rsp).toEqual([12, 13]);
    const receipt = sagaTester.getCalledActions()[1];
    expect(receipt.type).toEqual(RECEIPT_SET);
    expect(receipt.handId).toEqual(3);
    expect(receipt.pos).toEqual(1);
    expect(receipt.tableAddr).toEqual(tableAddr);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });

  it('should reset receipt when call fails', async (done) => {
    // mock a failed request
    nock('http://ab.com', { filteringScope: () => true })
      .filteringPath(() => '/')
      .post('/')
      .reply(401, '{"errorMessage":"unauthorized"}');

    const initialState = fromJS({
      table: {
        [tableAddr]: {
          data: {},
          3: {
            dealer: 0,
            state: 'flop',
            lineup: [{}, {}],
          },
        },
      },
    });
    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(formActionSaga);
    sagaTester.start(payFlow, new PokerHelper());
    const payAction = bet(tableAddr, 3, babz(500), PLAYER2.key, 1, 'prevReceipt');
    pay(payAction, (action) => sagaTester.dispatch(action)).catch((err) => {
      expect(err.response.status).toEqual(401);
      const receiptAction = sagaTester.getCalledActions()[2];
      expect(receiptAction.type).toEqual(RECEIPT_SET);
      expect(receiptAction.receipt).toEqual('prevReceipt');
      expect(receiptAction.handId).toEqual(3);
      expect(receiptAction.pos).toEqual(1);
      expect(receiptAction.tableAddr).toEqual(tableAddr);
      done();
    });
  });

  it('should add anonymous message about winner!', () => {
    const hand = {
      handId: 3,
      state: 'showdown',
      dealer: 0,
      sb: babz(50),

      lineup: [{
        address: PLAYER1.address,
        last: new Receipt(tableAddr).show(1, babz(1000)).sign(PLAYER1.key),
        cards: [21, 32],
      }, {
        address: PLAYER2.address,
        last: new Receipt(tableAddr).show(1, babz(1000)).sign(PLAYER2.key),
        cards: [36, 49],
      }],
      cards: [8, 23, 10],
    };

    const initialState = fromJS({
      account: {
        privKey: PLAYER2.key,
      },
      table: {
        [tableAddr]: {
          data: {},
          3: {
            lineup: [{
              address: PLAYER1.address,
              last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER1.key),
              cards: [21, 32],
            }, {
              address: PLAYER2.address,
              last: new Receipt(tableAddr).bet(1, babz(1000)).sign(PLAYER1.key),
              cards: [36, 49],
            }],
            state: 'dealing',
          },
        },
      },
    });

    const sagaTester = new SagaTester({ initialState });
    sagaTester.start(updateScanner, new PokerHelper());
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    const show = sagaTester.getLatestCalledAction();
    expect(show.type).toEqual(ADD_MESSAGE);
    expect(show.message).toEqual('player MARVIN won 0 NTZ ');
    expect(show.tableAddr).toEqual(tableAddr);
    expect(show.privKey).toEqual(null);
    // do the same thing again, and make sure the request
    // is deduplicated
    sagaTester.dispatch(updateReceived(tableAddr, hand));
    expect(sagaTester.getLatestCalledAction().type).toEqual(UPDATE_RECEIVED);
    expect(sagaTester.getCalledActions().length).toEqual(3);
  });
});
