/**
 * Created by helge on 02.02.17.
 */

import { PokerHelper, ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import { makeHandSelector, makeMyPosSelector, tableStateSelector } from '../Table/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const posSelector = (state, props) => (state && props) ? props.pos : null;

const makeLastRoundMaxBetSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.lastRoundMaxBet : null
);

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => (hand && hand.lineup && pos && hand.lineup[pos].last) ? rc.get(hand.lineup[pos].last) : undefined
);

const makeLastAmountSelector = () => createSelector(
    makeLastReceiptSelector(),
    (lastReceipt) => (lastReceipt) ? lastReceipt.values[1] : 0
);

const makeWhosTurnSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand) ? pokerHelper.whosTurn(hand) : null
);

const makeStackSelector = () => createSelector(
    [makeHandSelector(), makeMyPosSelector(), makeLastAmountSelector(), makeLastRoundMaxBetSelector()],
    (hand, myPos, lastAmount, lastRoundMaxBet) => {
      if (hand && myPos && lastAmount && lastRoundMaxBet) {
        let stack = hand.lineup[myPos].amount - lastAmount;
        if (lastRoundMaxBet && lastRoundMaxBet > 0) {
          stack -= lastRoundMaxBet;
        }
        return stack;
      }
      return null;
    }
);

const makeLastActionSelector = () => createSelector(
  [posSelector, makeHandSelector()],
  (pos, hand) => (hand && hand.lineup[pos].last) ? rc.get(hand.lineup[pos].last).abi[0].name : null
);

const makeCardSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => {
      let cards = [];
      if (hand && hand.lineup && pos) {
        const lu = hand.lineup;
        cards = (lu[pos].cards) ? lu[pos].cards : [-1, -1];
      }
      return cards;
    }
);

const makeFoldedSelector = () => createSelector(
    makeLastReceiptSelector(),
    (lastReceipt) => (lastReceipt) ? lastReceipt.abi[0].name === 'fold' : false
);

export {
    posSelector,
    makeLastReceiptSelector,
    makeLastAmountSelector,
    makeStackSelector,
    makeCardSelector,
    makeFoldedSelector,
    makeWhosTurnSelector,
    makeLastActionSelector,
};
