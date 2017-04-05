/**
 * Created by helge on 29.03.17.
 */

import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';

import {
  makeMaxBetSelector,
  makeMyMaxBetSelector,
  makeSbSelector,
  makeHandSelector,
} from '../Table/selectors';

import {
  makeMyStackSelector,
} from '../Seat/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const makeAmountToCallSelector = () => createSelector(
  [makeMaxBetSelector(), makeMyMaxBetSelector()],
  (maxBet, myMaxbet) => (maxBet > -1 && myMaxbet > -1) ? maxBet - myMaxbet : -1
);

const makeMinSelector = () => createSelector(
  [makeSbSelector(), makeHandSelector(), makeMyStackSelector(), makeAmountToCallSelector()],
  (sb, hand, stack, amountToCall) => {
    if (!sb || !hand) {
      return -1;
    }
    // if my stack smaller than BB return the left behind stack
    if (stack < sb * 2) {
      return stack;
    }
    const lineup = hand.get('lineup').toJS();
    const dealer = hand.get('dealer');
    const maxBet = pokerHelper.findMaxBet(lineup, dealer).amount;
    // check if there was a raise exclude preflop sb and bb
    const lastRoundMaxBet = hand.get('lastRoundMaxBet');
    const minRaise = pokerHelper.findMinRaiseAmount(lineup, dealer, lastRoundMaxBet);
    if (!(maxBet === sb * 2 && amountToCall <= sb * 2) && minRaise > -1) {
      return minRaise + amountToCall;
    }
    // otherwise return the BB
    return (sb * 2) + amountToCall;
  }
);

const makeCallAmountSelector = () => createSelector(
  [makeAmountToCallSelector(), makeMyStackSelector()],
  (amountToCall, stack) => (amountToCall > stack) ? stack : amountToCall
);

const makeMaxSelector = () => createSelector(
  [makeMinSelector(), makeMyStackSelector()],
  (min, stack) => (Math.floor(stack / min) * min) + min
);

export {
  makeAmountToCallSelector,
  makeMinSelector,
  makeMaxSelector,
  makeCallAmountSelector,
};
