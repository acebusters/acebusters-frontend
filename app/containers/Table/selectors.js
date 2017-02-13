import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { makeSelectAddress } from '../AccountProvider/selectors';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const tableStateSelector = (state) => (state) ? state.get('table') : null;


const makeHandSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('hand') : null
);

const makeLastHandNettedSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('lastHandNettedOnClient') : null
);

const makeMyPosSelector = createSelector(
    [makeHandSelector, makeSelectAddress],
    (hand, myAddress) => (hand && myAddress) ? pokerHelper.getMyPos(hand.get('lineup').toJS(), myAddress) : null
);

const makeWhosTurnSelector = createSelector(
    makeHandSelector,
    (hand) => (hand.get('lineup').size > 0) ? pokerHelper.whosTurn(hand.toJS()) : null
);

const makeIsMyTurnSelector = createSelector(
    [makeMyPosSelector, makeWhosTurnSelector],
    (myPos, whosTurn) => (myPos && whosTurn) ? myPos === whosTurn : false
);

const makeMaxBetSelector = createSelector(
    makeHandSelector,
    (hand) => (hand) ? pokerHelper.findMaxBet(hand.get('lineup').toJS(), hand.get('dealer')).amount : 0
);

const makeMyMaxBetSelector = createSelector(
    [makeHandSelector, makeSelectAddress],
    (hand, myAddress) => (hand && myAddress) ? pokerHelper.getMyMaxBet(hand.get('lineup').toJS(), myAddress) : 0
);

const makeAmountToCallSelector = createSelector(
    [makeMaxBetSelector, makeMyMaxBetSelector],
    (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makePotSizeSelector = createSelector(
    makeHandSelector,
    (hand) => (hand) ? pokerHelper.calculatePotsize(hand.get('lineup')) : 0
);

export {
    tableStateSelector,
    makeIsMyTurnSelector,
    makeLastHandNettedSelector,
    makePotSizeSelector,
    makeAmountToCallSelector,
    makeMyPosSelector,
    makeHandSelector,
    makeMaxBetSelector,
    makeMyMaxBetSelector,
};

