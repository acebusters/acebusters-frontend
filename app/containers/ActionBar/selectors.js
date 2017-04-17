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
    if (!sb || !hand || hand.get('state') === 'waiting') {
      return -1;
    }
    // if my stack smaller than BB return the left behind stack
    if (stack < sb * 2) {
      return stack;
    }
    const handState = hand.get('state');
    const lineup = hand.get('lineup').toJS();
    const dealer = hand.get('dealer');
    const maxBet = pokerHelper.getMaxBet(lineup, handState).amount;
    // check if there was a raise exclude preflop sb and bb
    const lastRoundMaxBet = hand.get('lastRoundMaxBet');
    let minRaise;
    try {
      minRaise = pokerHelper.findMinRaiseAmount(lineup, dealer, lastRoundMaxBet);
    } catch (e) {
      // there was no raise
      if (e.message === 'can not find minRaiseAmount.') {
        return (sb * 2) + amountToCall;
      }
      throw (e);
    }
    if (!(maxBet === sb * 2 && amountToCall <= sb * 2)) {
      return minRaise + amountToCall;
    }
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
