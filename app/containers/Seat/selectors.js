/**
 * Created by helge on 02.02.17.
 */
import EWT from 'ethereum-web-token';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import { makeHandSelector, makeMyPosSelector, tableStateSelector } from '../Table/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const makeLastRoundMaxBetSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.lastRoundMaxBet : null
);

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector(), makeMyPosSelector()],
    (hand, myPos) => (hand && hand.lineup && myPos && hand.lineup[myPos].last) ? EWT.parse(hand.lineup[myPos].last) : undefined
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

const makeCardSelector = () => createSelector(
    [makeHandSelector(), makeMyPosSelector()],
    (hand, myPos) => {
      if (hand && hand.lineup && myPos) {
        const lu = hand.lineup;
        const cards = (lu[myPos].cards) ? lu[myPos].cards : [0, 0];
        return cards;
      }
      return [0, 0];
    }
);

const makeFoldedSelector = () => createSelector(
    makeLastReceiptSelector(),
    (lastReceipt) => (lastReceipt) ? lastReceipt.abi[0].name === 'fold' : false
);

export {
    makeLastReceiptSelector,
    makeLastAmountSelector,
    makeStackSelector,
    makeCardSelector,
    makeFoldedSelector,
    makeWhosTurnSelector,
};
