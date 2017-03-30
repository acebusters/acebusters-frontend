/**
 * Created by helge on 29.03.17.
 */

import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';

import {
  makeMaxBetSelector,
  makeMyMaxBetSelector,
  makeSbSelector,
  makeMyStackSelector,
  makeHandSelector,
} from '../Table/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const makeAmountToCallSelector = () => createSelector(
  [makeMaxBetSelector(), makeMyMaxBetSelector()],
  (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makeLeftBehindSelector = () => createSelector(
  [makeMyStackSelector(), makeMyMaxBetSelector()],
  (stack, myMaxBet) => {
    if (!stack) {
      return -1;
    }
    return (stack - myMaxBet);
  }
);

const makeMinSelector = () => createSelector(
  [makeSbSelector(), makeHandSelector(), makeLeftBehindSelector()],
  (sb, hand, leftBehind) => {
    if (!sb || !hand) {
      return -1;
    }
    // if my stack smaller than BB return the left behind stack
    if (leftBehind < sb * 2) {
      return leftBehind;
    }
    // check if there was a raise
    const lineup = hand.get('lineup').toJS();
    const dealer = hand.get('dealer');
    const lastRoundMaxBet = hand.get('lastRoundMaxBet');
    const minRaise = pokerHelper.findMinRaiseAmount(lineup, dealer, lastRoundMaxBet);
    if (minRaise > -1) {
      return minRaise;
    }
    // otherwise return the BB
    return (sb * 2);
  }
);

const makeCallAmountSelector = () => createSelector(
  [makeAmountToCallSelector(), makeLeftBehindSelector()],
  (amountToCall, leftBehind) => (amountToCall > leftBehind) ? leftBehind : amountToCall
);

const makeMaxSelector = () => createSelector(
  [makeMinSelector(), makeMyStackSelector()],
  (min, stack) => (Math.floor(stack / min) * min) + min
);

export {
  makeAmountToCallSelector,
  makeMinSelector,
  makeLeftBehindSelector,
  makeMaxSelector,
  makeCallAmountSelector,
};
