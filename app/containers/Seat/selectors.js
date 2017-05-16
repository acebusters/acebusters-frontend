/**
 * Created by helge on 02.02.17.
 */

import { ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import EWT from 'ethereum-web-token';
import {
  makeHandSelector,
  makeLineupSelector,
  makeMyPosSelector,
  tableStateSelector,
  makeWhosTurnSelector,
} from '../Table/selectors';

import { createBlocky } from '../../services/blockies';

import {
  SEAT_COORDS,
  AMOUNT_COORDS,
} from '../../app.config';

const rc = new ReceiptCache();

// Note: in Seat, position is stored in props.pos; in ActionBar, position is stored in props.myPos
// FIXME: there should be a better way than hard coding these 2 fields
const posSelector = (state, props) => {
  if (!state || !props) return -1;
  if (props.pos !== undefined) return props.pos;
  if (props.myPos !== undefined) return props.myPos;

  return -1;
};

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => (hand && pos > -1 && hand.getIn && hand.getIn(['lineup', pos])) ? rc.get(hand.getIn(['lineup', pos, 'last'])) : undefined
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
    if (pos === -1 || myPos === undefined || !hand || !hand.get('lineup')) {
      return [-1, -1];
    }
    if (pos === myPos && hand.get('holeCards')) {
      return hand.get('holeCards').toJS();
    }
    return (hand.get('lineup').toJS()[pos].cards) ? hand.get('lineup').toJS()[pos].cards : [-1, -1];
  }
);

const makeOpenSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? (lineup.toJS()[pos].address.indexOf('0x0000000000000000000000000000000000000000') > -1) : false
);

const makeSitoutSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos !== undefined && lineup.getIn([pos, 'sitout']))
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

const makeStackSelector = () => createSelector(
  [tableStateSelector, posSelector],
  selectStack
);

const makeMyStackSelector = () => createSelector(
  [tableStateSelector, makeMyPosSelector()],
  selectStack
);

const selectStack = (table, pos) => {
  // make sure we have a position to work on
  if (typeof pos === 'undefined') {
    return null;
  }
  // get state of contract
  const lastHandNetted = table.getIn(['data', 'lastHandNetted']);
  if (typeof lastHandNetted === 'undefined' || lastHandNetted < 1) {
    return null;
  }
  const addr = table.getIn(['data', 'seats', pos, 'address']);
  let amount = table.getIn(['data', 'amounts', pos]);
  // get progress of state channel
  let maxHand = 0;
  table.keySeq().forEach((k) => {
    if (!isNaN(k)) {
      const handId = parseInt(k, 10);
      if (handId > maxHand) {
        maxHand = handId;
      }
    }
  });
  // handle empty state channel
  if (maxHand === 0 || maxHand <= lastHandNetted) {
    return amount;
  }
  // sum up state channel
  for (let i = lastHandNetted + 1; i <= maxHand; i += 1) {
    // get all the bets
    const rec = table.getIn([i.toString(), 'lineup', pos, 'last']);
    const bet = (rec) ? rc.get(rec).values[1] : 0;
    if (typeof bet !== 'undefined') {
      amount -= bet;
    }
    // get all the winnings
    const distsRec = table.getIn([i.toString(), 'distribution']);
    if (distsRec) {
      const dists = rc.get(distsRec);
      for (let j = 0; j < dists.values[2].length; j += 1) {
        const dist = EWT.separate(dists.values[2][j]);
        if (dist.address === addr) {
          amount += dist.amount;
        }
      }
    }
  }
  return amount;
};

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
  makeMyStackSelector,
  makeStackSelector,
  makeLastActionSelector,
};
