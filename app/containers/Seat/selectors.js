/**
 * Created by helge on 02.02.17.
 */

import { PokerHelper, ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import { makeHandSelector, makeMyPosSelector, tableStateSelector } from '../Table/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const posSelector = (state, props) => (state && props) ? props.pos : null;

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector, posSelector],
    (hand, pos) => (hand && hand.getIn && hand.getIn(['lineup', pos])) ? rc.get(hand.getIn(['lineup', pos, 'last'])).toJS() : undefined
);

const makeLastAmountSelector = () => createSelector(
    makeLastReceiptSelector,
    (lastReceipt) => (lastReceipt && lastReceipt.values) ? lastReceipt.values[1] : 0
);

const makeWhosTurnSelector = () => createSelector(
  makeHandSelector,
  (hand) => (hand && hand.toJS) ? pokerHelper.whosTurn(hand.toJS()) : null
);

const makeStackSelector = () => createSelector(
    [tableStateSelector, makeMyPosSelector],
    (tableState, myPos) => {
      if (tableState && myPos && tableState.getIn(['data', 'amounts'])) {
        const amounts = tableState.getIn(['data', 'amounts']).toJS();
        return amounts[myPos];
      }
      return 0;
    }
);

const makeLastActionSelector = () => createSelector(
  [posSelector, makeHandSelector],
  (pos, hand) => {
    if (hand && hand.getIn && hand.getIn(['lineup', pos, 'last'])) {
      return rc.get(hand.getIn(['lineup', pos, 'last'])).abi[0].name;
    }
    return null;
  }
);

const makeCardSelector = () => createSelector(
    [posSelector, makeMyPosSelector(), makeHandSelector()],
    (pos, myPos, hand) => {
      if (pos === myPos) {
        return (hand && hand.get('holeCards')) ? hand.get('holeCards') : [-1, -1];
      }
      return [-1, -1];
    }
);

const makeFoldedSelector = () => createSelector(
    makeLastReceiptSelector,
    (lastReceipt) => (lastReceipt && lastReceipt.abi) ? lastReceipt.abi[0].name === 'fold' : false
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
