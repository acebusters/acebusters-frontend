import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import { makeSelectProxyAddr } from '../AccountProvider/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// direct selectors to state
const tableStateSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr]) : null;

const handSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr, props.params.handId.toString()]) : null;

// other selectors
const makeHandSelector = () => createSelector(
  handSelector,
  (hand) => hand
);

const makeTableDataSelector = () => createSelector(
  tableStateSelector,
  (table) => (table) ? (table.get('data')) : null
);

const makeLineupSelector = () => createSelector(
  [handSelector, tableStateSelector],
  (hand, table) => {
    // we have no table yet
    if (!table || !table.get('data')) {
      return null;
    }

    // we have table, but no hand
    if (!hand || !hand.get('lineup')) {
      return table.getIn(['data', 'seats']);
    }
    // if we have a hand, just get the hand
    return hand.get('lineup');
  }
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

const makeNetRequestSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState && tableState.get) ? tableState.get('netting') : null
);

export {
    tableStateSelector,
    makeTableDataSelector,
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
    makeNetRequestSelector,
};

