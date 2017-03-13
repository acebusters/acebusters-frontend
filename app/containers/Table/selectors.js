import { createSelector } from 'reselect';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import EWT from 'ethereum-web-token';
import { makeSignerAddrSelector } from '../AccountProvider/selectors';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// direct selectors to state
const tableStateSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr]) : null;

const handSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr, props.params.handId.toString()]) : null;

const posSelector = (state, props) => (props) ? props.pos : null;

// other selectors
const makeHandSelector = () => createSelector(
  handSelector,
  (hand) => hand
);

const makeHandStateSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand) ? hand.get('state') : null
);

const makeBoardSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get('cards')) ? hand.get('cards').toJS() : null
);

const makeTableDataSelector = () => createSelector(
  tableStateSelector,
  (table) => (table) ? (table.get('data')) : null
);

const makeMyStackSelector = () => createSelector(
  [tableStateSelector, makeMyPosSelector()],
  (tableState, myPos) => {
    if (tableState && myPos && tableState.getIn(['data', 'amounts'])) {
      const amounts = tableState.getIn(['data', 'amounts']).toJS();
      return amounts[myPos];
    }
    return 0;
  }
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
  (tableState) => (tableState) ? tableState.get('lastHandNettedOnClient') : null
);

const makeNetRequestSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState) ? tableState.get('netting') : null
);

const makeComputedSelector = () => createSelector(
  tableStateSelector,
  (tableState) => (tableState) ? tableState.get('computedStyles') : null
);

const makeMyPosSelector = () => createSelector(
  [makeLineupSelector(), makeSignerAddrSelector()],
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
  (hand, lineup) => (hand && lineup && lineup.toJS) ? pokerHelper.findMaxBet(lineup.toJS(), hand.get('dealer')).amount : 0
);

const makeMyMaxBetSelector = () => createSelector(
  [makeLineupSelector(), makeSignerAddrSelector()],
  (lineup, myAddress) => (lineup && lineup.toJS && myAddress) ? pokerHelper.getMyMaxBet(lineup.toJS(), myAddress) : 0
);

const makeAmountToCallSelector = () => createSelector(
  [makeMaxBetSelector(), makeMyMaxBetSelector()],
  (maxBet, myMaxbet) => (maxBet && myMaxbet) ? maxBet - myMaxbet : 0
);

const makeStackSelector = () => createSelector(
  [tableStateSelector, posSelector],
  (table, pos) => {
    // make sure we have a position to work on
    if (typeof pos === 'undefined') {
      return null;
    }
    // get state of contract
    const lastHandNetted = table.getIn(['data', 'lastHandNetted']);
    if (typeof lastHandNetted === 'undefined' || lastHandNetted < 1) {
      return null;
    }
    const addr = table.getIn(['data', 'seats', pos, 'address']);
    let amount = table.getIn(['data', 'amounts', pos]);
    // get progress of state channel
    let maxHand = 0;
    table.keySeq().forEach((k) => {
      if (!isNaN(k)) {
        const handId = parseInt(k, 10);
        if (handId > maxHand) {
          maxHand = handId;
        }
      }
    });
    // handle empty state channel
    if (maxHand === 0) {
      return amount;
    }
    if (maxHand <= lastHandNetted) {
      return amount;
    }
    // sum up state channel
    for (let i = lastHandNetted + 1; i <= maxHand; i += 1) {
      // get all the bets
      const rec = table.getIn([i.toString(), 'lineup', pos, 'last']);
      const bet = (rec) ? EWT.parse(rec).values[1] : 0;
      if (typeof bet !== 'undefined') {
        amount -= bet;
      }
      // get all the winnings
      const distsRec = table.getIn([i.toString(), 'distribution']);
      if (distsRec) {
        const dists = EWT.parse(distsRec);
        for (let j = 0; j < dists.values[2].length; j += 1) {
          const dist = EWT.separate(dists.values[2][j]);
          if (dist.address === addr) {
            amount += dist.amount;
          }
        }
      }
    }
    return amount;
  }
);

const makePotSizeSelector = () => createSelector(
  makeLineupSelector(),
  (lineup) => (lineup) ? pokerHelper.calculatePotsize(lineup.toJS()) : 0
);

export {
    tableStateSelector,
    makeTableDataSelector,
    makeAmountSelector,
    makeLineupSelector,
    makeMyStackSelector,
    makeHandStateSelector,
    makeBoardSelector,
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
    makeComputedSelector,
    makeStackSelector,
};

