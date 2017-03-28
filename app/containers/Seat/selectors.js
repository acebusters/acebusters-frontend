/**
 * Created by helge on 02.02.17.
 */

import { PokerHelper, ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import {
  makeHandSelector,
  makeLineupSelector,
  makeMyPosSelector,
} from '../Table/selectors';

import { createBlocky } from '../../services/blockies';

import {
  SEAT_COORDS,
  AMOUNT_COORDS,
} from '../../app.config';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const posSelector = (state, props) => (state && props) ? props.pos : -1;

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => (hand && pos && hand.getIn && hand.getIn(['lineup', pos])) ? rc.get(hand.getIn(['lineup', pos, 'last'])) : undefined
);

const makeLastRoundMaxBetSelector = () => createSelector(
  [makeHandSelector()],
  (hand) => (hand && hand.get && hand.get('lastRoundMaxBet')) ? hand.get('lastRoundMaxBet') : 0
);

const makeLastAmountSelector = () => createSelector(
    [makeLastReceiptSelector(), makeLastRoundMaxBetSelector(), makeHandSelector()],
    (lastReceipt, maxBet, hand) => {
      if (lastReceipt && lastReceipt.values && hand && hand.get) {
        if (hand.get('state') === 'preflop') {
          return lastReceipt.values[1];
        }
        return lastReceipt.values[1] - maxBet;
      }
      return 0;
    }
);

const makeWhosTurnSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.toJS) ? pokerHelper.whosTurn(hand.toJS()) : null
);

const makeLastActionSelector = () => createSelector(
  [posSelector, makeHandSelector()],
  (pos, hand) => {
    if (hand && hand.getIn && hand.getIn(['lineup', pos, 'last'])) {
      return rc.get(hand.getIn(['lineup', pos, 'last'])).abi[0].name;
    }
    return null;
  }
);

const makeCardsSelector = () => createSelector(
  [posSelector, makeHandSelector(), makeMyPosSelector()],
  (pos, hand, myPos) => {
    if (pos === -1 || !hand || myPos === -1 || hand.get('lineup')) {
      return [-1, -1];
    }
    if (pos === myPos) {
      return hand.get('holeCards').toJS();
    }
    return hand.get('lineup').toJS()[pos].cards;
  }
);

const makeOpenSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? (lineup.toJS()[pos].address.indexOf('0x0000000000000000000000000000000000000000') > -1) : false
);

const makeSitoutSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? lineup.toJS()[pos].sitout : false
);

const makePendingSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? lineup.toJS()[pos].pending : false
);

const makeDealerSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get) ? hand.get('dealer') : -1
);

const makeMyCardsSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get('holeCards')) ? hand.get('holeCards').toJS() : [-1, -1]
);

const makeFoldedSelector = () => createSelector(
    makeLastReceiptSelector(),
    (lastReceipt) => (lastReceipt && lastReceipt.abi) ? lastReceipt.abi[0].name === 'fold' : false
);

const makeCoordsSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? SEAT_COORDS[lineup.toJS().length.toString()][pos] : null
);

const makeAmountCoordsSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? AMOUNT_COORDS[lineup.toJS().length.toString()][pos] : null
);

const makeBlockySelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? createBlocky(lineup.getIn([pos, 'address'])) : ''
);

export {
  posSelector,
  makeLastReceiptSelector,
  makeSitoutSelector,
  makeLastAmountSelector,
  makeDealerSelector,
  makePendingSelector,
  makeOpenSelector,
  makeCoordsSelector,
  makeAmountCoordsSelector,
  makeBlockySelector,
  makeCardsSelector,
  makeLastRoundMaxBetSelector,
  makeMyCardsSelector,
  makeFoldedSelector,
  makeWhosTurnSelector,
  makeLastActionSelector,
};
