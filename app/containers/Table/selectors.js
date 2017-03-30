import { createSelector } from 'reselect';
import EWT from 'ethereum-web-token';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import Solver from 'pokersolver';
import { makeSignerAddrSelector } from '../AccountProvider/selectors';
import {
  valuesShort,
  suits,
} from '../../app.config';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// direct selectors to state
const tableStateSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr]) : null;

const handSelector = (state, props) => (state && props) ? state.getIn(['table', props.params.tableAddr, props.params.handId.toString()]) : null;

const posSelector = (state, props) => (props) ? props.pos : null;

const actionSelector = (action) => action;

const addressSelector = (state, props) => (props) ? props.address : null;

const myPosByAction = createSelector(
  [actionSelector, addressSelector],
  (action, myAddr) => {
    if (!myAddr || !action.hand || !action.hand.lineup) {
      return -1;
    }
    for (let i = 0; i < action.hand.lineup.length; i += 1) {
      if (myAddr === action.hand.lineup[i].address) {
        return i;
      }
    }
    return -1;
  }
);

const lastAmountByAction = createSelector(
  [actionSelector, myPosByAction],
  (action, myPos) => {
    if (typeof myPos === 'undefined' || myPos < 0) {
      return -1;
    }
    if (!action.hand || !action.hand.lineup ||
      !action.hand.lineup[myPos] || !action.hand.lineup[myPos].last) {
      return -1;
    }
    const receipt = rc.get(action.hand.lineup[myPos].last);
    return receipt.values[1];
  }
);

const isSbTurnByAction = createSelector(
  [actionSelector, myPosByAction],
  (action, myPos) => {
    if (!action.hand) {
      return false;
    }
    const sbPos = pokerHelper.getSbPos(action.hand.lineup, action.hand.dealer);
    if (typeof sbPos === 'undefined' || sbPos < 0) {
      return false;
    }
    const whosTurn = pokerHelper.whosTurn(action.hand);
    if (typeof whosTurn === 'undefined' || whosTurn < 0) {
      return false;
    }
    if (action.hand.state === 'waiting' && whosTurn === sbPos && sbPos === myPos) {
      return true;
    }
    return false;
  }
);

const isBbTurnByAction = createSelector(
  [actionSelector, myPosByAction],
  (action, myPos) => {
    if (!action.hand) {
      return false;
    }
    const bbPos = pokerHelper.getBbPos(action.hand.lineup, action.hand.dealer);
    if (typeof bbPos === 'undefined' || bbPos < 0) {
      return false;
    }
    const whosTurn = pokerHelper.whosTurn(action.hand);
    if (typeof whosTurn === 'undefined' || whosTurn < 0) {
      return false;
    }
    if (action.hand.state === 'dealing' && whosTurn === bbPos && bbPos === myPos) {
      return true;
    }
    return false;
  }
);

const is0rTurnByAction = createSelector(
  [actionSelector, myPosByAction, isSbTurnByAction, isBbTurnByAction],
  (action, myPos, sbTurn, bbTurn) => {
    if (!action.hand || !action.hand.lineup) {
      return false;
    }
    const whosTurn = pokerHelper.whosTurn(action.hand);
    if (typeof whosTurn === 'undefined' || whosTurn < 0) {
      return false;
    }
    if (action.hand.state === 'dealing' && !sbTurn && !bbTurn && whosTurn === myPos) {
      return true;
    }
    return false;
  }
);

const isShowTurnByAction = createSelector(
  [actionSelector, myPosByAction],
  (action, myPos) => {
    if (!action || !action.hand || action.hand.state !== 'showdown') {
      return false;
    }
    const whosTurn = pokerHelper.whosTurn(action.hand);
    if (typeof whosTurn === 'undefined' || whosTurn < 0) {
      return false;
    }
    if (whosTurn === myPos) {
      return true;
    }
    return false;
  }
);

const hasNettingInAction = createSelector(
  [actionSelector, addressSelector],
  (action, myAddr) => {
    // check data available
    if (!myAddr || !action || !action.hand || !action.hand.netting) {
      return false;
    }
    // check already signed
    if (action.hand.netting[myAddr]) {
      return false;
    }
    return true;
  }
);

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
  (hand) => (hand && hand.get('cards')) ? hand.get('cards').toJS() : []
);

const makeTableDataSelector = () => createSelector(
  tableStateSelector,
  (table) => (table) ? (table.get('data')) : null
);

const makeSbSelector = () => createSelector(
  [makeTableDataSelector()],
  (data) => {
    if (!data || typeof data.get('smallBlind') === 'undefined') {
      return null;
    }
    return data.get('smallBlind');
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

const makeSelectWinners = () => createSelector(
  [makeHandSelector(), makeBoardSelector()],
  (hand, board) => {
    if (!hand || !hand.get || !hand.get('distribution')) {
      return {};
    }
    const boardCards = board.map((c) => valuesShort[c % 52] + suits[Math.floor([c / 13])]);
    const lineup = hand.get('lineup').toJS();
    const wHands = Solver.Hand.winners(lineup.filter((obj) => obj.cards).map((player, index) => {
      const pHand = [];
      const card1 = valuesShort[player.cards[0] % 13] + suits[Math.floor([player.cards[0] / 13])];
      const card2 = valuesShort[player.cards[1] % 13] + suits[Math.floor([player.cards[1] / 13])];
      pHand.push(...boardCards, card1, card2);
      const handObj = Solver.Hand.solve(pHand);
      lineup[index].hand = handObj.descr;
      return handObj;
    }));
    const winners = {};
    lineup.forEach((player, i) => {
      wHands.forEach((wHand) => {
        if (wHand.descr === player.hand) {
          winners[i] = {};
          winners[i].hand = player.hand;
          winners[i].addr = player.address;
        }
      });
    });
    // add amounts
    const distsRec = hand.get('distribution');
    if (distsRec) {
      const dists = rc.get(distsRec);
      dists.values[2].forEach((dist, i) => {
        const pDist = EWT.separate(dist);
        if (winners[i] && pDist.address === winners[i].addr) {
          winners[i].amount = pDist.amount;
        }
      });
    }
    return winners;
  }
);

const makeMyPosSelector = () => createSelector(
  [makeLineupSelector(), makeSignerAddrSelector()],
  (lineup, myAddress) => (lineup && myAddress) ? pokerHelper.getMyPos(lineup.toJS(), myAddress) : -1
);

const makeWhosTurnSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get('lineup').size > 0) ? pokerHelper.whosTurn(hand.toJS()) : -1
);

const makeIsMyTurnSelector = () => createSelector(
  [makeMyPosSelector(), makeWhosTurnSelector()],
  (myPos, whosTurn) => (myPos > -1 && whosTurn > -1) ? myPos === whosTurn : false
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

const makeMissingHandSelector = () => createSelector(
  [tableStateSelector],
  (table) => {
    if (!table) {
      return null;
    }
    // get state of contract
    const lastHandNetted = table.getIn(['data', 'lastHandNetted']);
    if (typeof lastHandNetted === 'undefined' || lastHandNetted < 1) {
      return null;
    }
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
    if (maxHand <= lastHandNetted) {
      return [lastHandNetted + 1];
    }
    const rsp = [];
    for (let i = lastHandNetted + 1; i < maxHand; i += 1) {
      if (!table.get(i.toString())) {
        rsp.push(i);
      }
    }
    return rsp;
  }
);

const makeLatestHandSelector = () => createSelector(
  [tableStateSelector],
  (table) => {
    if (!table) {
      return null;
    }

    // get progress of state channel
    let maxHand = 2;
    table.keySeq().forEach((k) => {
      if (!isNaN(k)) {
        const handId = parseInt(k, 10);
        if (handId > maxHand) {
          maxHand = handId;
        }
      }
    });

    return maxHand;
  }
);

const makeStackSelector = () => createSelector(
  [tableStateSelector, posSelector],
  selectStack
);

const makeMyStackSelector = () => createSelector(
  [tableStateSelector, makeMyPosSelector()],
  selectStack
);

const makePotSizeSelector = () => createSelector(
  makeLineupSelector(),
  (lineup) => (lineup) ? pokerHelper.calculatePotsize(lineup.toJS()) : 0
);

const selectStack = (table, pos) => {
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
    const bet = (rec) ? rc.get(rec).values[1] : 0;
    if (typeof bet !== 'undefined') {
      amount -= bet;
    }
    // get all the winnings
    const distsRec = table.getIn([i.toString(), 'distribution']);
    if (distsRec) {
      const dists = rc.get(distsRec);
      for (let j = 0; j < dists.values[2].length; j += 1) {
        const dist = EWT.separate(dists.values[2][j]);
        if (dist.address === addr) {
          amount += dist.amount;
        }
      }
    }
  }
  return amount;
};

export {
    tableStateSelector,
    actionSelector,
    lastAmountByAction,
    isSbTurnByAction,
    isBbTurnByAction,
    is0rTurnByAction,
    isShowTurnByAction,
    hasNettingInAction,
    makeTableDataSelector,
    makeSbSelector,
    makeLineupSelector,
    makeSelectWinners,
    makeHandStateSelector,
    makeLatestHandSelector,
    makeBoardSelector,
    makeIsMyTurnSelector,
    makeWhosTurnSelector,
    makePotSizeSelector,
    makeAmountToCallSelector,
    makeMyPosSelector,
    makeHandSelector,
    makeMaxBetSelector,
    makeMyMaxBetSelector,
    makeMyStackSelector,
    makeStackSelector,
    makeMissingHandSelector,
};

