import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { addressSelector } from '../Account/selectors';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const tableStateSelector = (state) => (state) ? state.TableReducer : null;

const makeHandSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.hand : null
);

const makeLastHandNettedSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState) ? tableState.lastHandNettedOnClient : null
);

const makeMyPosSelector = createSelector(
    [tableStateSelector, addressSelector],
    (tableState, myAddress) => (tableState && tableState.hand && myAddress) ? pokerHelper.getMyPos(tableState.hand.lineup, myAddress) : null
);

const makeWhosTurnSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState && tableState.hand) ? pokerHelper.whosTurn(tableState.hand) : null
);

const makeIsMyTurnSelector = createSelector(
    [makeMyPosSelector, makeWhosTurnSelector],
    (myPos, whosTurn) => (myPos && whosTurn) ? myPos === whosTurn : false
);

const makeMaxBetSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState && tableState.hand) ? pokerHelper.findMaxBet(tableState.hand.lineup, tableState.hand.dealer).amount : 0
);

const makeMyMaxBetSelector = createSelector(
    [tableStateSelector, addressSelector],
    (tableState, myAddress) => (tableState && tableState.hand && myAddress) ? pokerHelper.getMyMaxBet(tableState.hand.lineup, myAddress) : 0
);

const makeAmountToCallSelector = createSelector(
    [makeMaxBetSelector, makeMyMaxBetSelector],
    (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : false
);

const makePotSizeSelector = createSelector(
    tableStateSelector,
    (tableState) => (tableState && tableState.hand) ? pokerHelper.calculatePotsize(tableState.hand.lineup) : 0
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

