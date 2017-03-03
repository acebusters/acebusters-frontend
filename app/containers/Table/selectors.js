import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { makeSelectProxyAddr } from '../AccountProvider/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// direct selectors to state
const tableStateSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr]) : null;

// other selectors
const makeHandSelector = () => createSelector(
  tableStateSelector,
  (tableState) => tableState
);

const makeLineupSelector = () => createSelector(
  makeHandSelector(),
  (table) => (table && table.get) ? table.get('lineup') : null
);

const makeAmountSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState) ? tableState.get('amount') : null
);

const makeLastHandNettedSelector = () => createSelector(
    tableStateSelector,
    (tableState) => (tableState && tableState.get) ? tableState.get('lastHandNettedOnClient') : null
);

const makeMyPosSelector = () => createSelector(
    [makeLineupSelector, makeSelectProxyAddr],
    (lineup, myAddress) => (lineup && lineup.toJS && myAddress) ? pokerHelper.getMyPos(lineup.toJS(), myAddress) : null
);

const makeWhosTurnSelector = () => createSelector(
    makeHandSelector,
    (hand) => (hand && hand.get && hand.get('lineup').size > 0) ? pokerHelper.whosTurn(hand.toJS()) : null
);

const makeIsMyTurnSelector = () => createSelector(
    [makeMyPosSelector, makeWhosTurnSelector],
    (myPos, whosTurn) => (myPos && whosTurn) ? myPos === whosTurn : false
);

const makeMaxBetSelector = () => createSelector(
    [makeHandSelector, makeLineupSelector],
    (hand, lineup) => (hand && lineup) ? pokerHelper.findMaxBet(lineup.toJS(), hand.get('dealer')).amount : 0
);

const makeMyMaxBetSelector = () => createSelector(
    [makeLineupSelector, makeSelectProxyAddr],
    (lineup, myAddress) => (lineup && lineup.toJS && myAddress) ? pokerHelper.getMyMaxBet(lineup.toJS(), myAddress) : 0
);

const makeAmountToCallSelector = () => createSelector(
    [makeMaxBetSelector, makeMyMaxBetSelector],
    (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makePotSizeSelector = () => createSelector(
    makeLineupSelector,
    (lineup) => (lineup && lineup.toJS) ? pokerHelper.calculatePotsize(lineup.toJS()) : 0
);

const makeModalStackSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState && tableState.get && tableState.get('modalStack')) ? tableState.get('modalStack').toJS() : []
);

const makeNetRequestSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState && tableState.get) ? tableState.get('netting') : null
);

export {
    tableStateSelector,
    makeAmountSelector,
    makeLineupSelector,
    makeIsMyTurnSelector,
    makeWhosTurnSelector,
    makeLastHandNettedSelector,
    makePotSizeSelector,
    makeAmountToCallSelector,
    makeMyPosSelector,
    makeHandSelector,
    makeMaxBetSelector,
    makeMyMaxBetSelector,
    makeModalStackSelector,
    makeNetRequestSelector,
};

