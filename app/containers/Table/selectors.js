import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { makeAddressSelector } from '../AccountProvider/selectors';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const tableStateSelector = (state) => (state) ? state.get('table') : null;

const makeHandSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('hand') : null
);

const makeLineupSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand.get('lineup')) ? hand.get('lineup') : null
);

const makeAmountSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState) ? tableState.get('amount') : null
);

const makeLastHandNettedSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.get('lastHandNettedOnClient') : null
);

const makeMyPosSelector = () => createSelector(
    [makeLineupSelector(), makeAddressSelector()],
    (lineup, myAddress) => (lineup && myAddress) ? pokerHelper.getMyPos(lineup.toJS(), myAddress) : null
);

const makeWhosTurnSelector = () => createSelector(
    makeHandSelector(),
    (hand) => (hand && hand.get('lineup').size > 0) ? pokerHelper.whosTurn(hand.toJS()) : null
);

const makeIsMyTurnSelector = () => createSelector(
    [makeMyPosSelector(), makeWhosTurnSelector()],
    (myPos, whosTurn) => (myPos && whosTurn) ? myPos === whosTurn : false
);

const makeMaxBetSelector = () => createSelector(
    [makeHandSelector(), makeLineupSelector()],
    (hand, lineup) => (hand && lineup) ? pokerHelper.findMaxBet(lineup.toJS(), hand.get('dealer')).amount : 0
);

const makeMyMaxBetSelector = () => createSelector(
    [makeLineupSelector(), makeAddressSelector()],
    (lineup, myAddress) => (lineup && myAddress) ? pokerHelper.getMyMaxBet(lineup.toJS(), myAddress) : 0
);

const makeAmountToCallSelector = () => createSelector(
    [makeMaxBetSelector(), makeMyMaxBetSelector()],
    (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makePotSizeSelector = () => createSelector(
    makeLineupSelector(),
    (lineup) => (lineup) ? pokerHelper.calculatePotsize(lineup) : 0
);

export {
    tableStateSelector,
    makeAmountSelector,
    makeLineupSelector,
    makeIsMyTurnSelector,
    makeLastHandNettedSelector,
    makePotSizeSelector,
    makeAmountToCallSelector,
    makeMyPosSelector,
    makeHandSelector,
    makeMaxBetSelector,
    makeMyMaxBetSelector,
};

