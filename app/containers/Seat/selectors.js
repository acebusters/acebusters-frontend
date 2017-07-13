/**
 * Created by helge on 02.02.17.
 */

import { Type, PokerHelper, ReceiptCache } from 'poker-helper';
import { createSelector } from 'reselect';
import {
  makeHandSelector,
  makeLineupSelector,
  makeMyPosSelector,
  tableStateSelector,
  makeWhosTurnSelector,
  makeSbSelector,
  makeLastRoundMaxBetSelector,
} from '../Table/selectors';

import { makeSignerAddrSelector } from '../AccountProvider/selectors';

import { createBlocky } from '../../services/blockies';

import {
  SEAT_COORDS,
  AMOUNT_COORDS,
  STATUS_MSG,
} from '../../app.config';

import { getPosCoords } from './utils';

const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// Note: in Seat, position is stored in props.pos; in ActionBar, position is stored in props.myPos
// FIXME: there should be a better way than hard coding these 2 fields
const posSelector = (state, props) => {
  if (!state || !props) return -1;
  if (props.pos !== undefined) return props.pos;
  if (props.myPos !== undefined) return props.myPos;

  return -1;
};

const makeLastReceiptSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => (hand && pos > -1 && hand.getIn && hand.getIn(['lineup', pos])) ? rc.get(hand.getIn(['lineup', pos, 'last'])) : undefined
);

const makeSeatSelector = () => createSelector(
    [makeHandSelector(), posSelector],
    (hand, pos) => (hand && pos > -1 && hand.getIn && hand.getIn(['lineup', pos])) ? hand.getIn(['lineup', pos]) : undefined
);

const makeLastAmountSelector = () => createSelector(
    [makeLastReceiptSelector(), makeLastRoundMaxBetSelector(), makeHandSelector()],
    (lastReceipt, maxBet, hand) => {
      if (lastReceipt && lastReceipt.amount && hand && hand.get) {
        if (hand.get('state') === 'preflop') {
          return lastReceipt.amount.toNumber();
        }
        return lastReceipt.amount.toNumber() - maxBet;
      }
      return 0;
    }
);

const makeLastActionSelector = () => createSelector(
  [posSelector, makeHandSelector()],
  (pos, hand) => {
    if (hand && hand.getIn && hand.getIn(['lineup', pos, 'last'])) {
      return rc.get(hand.getIn(['lineup', pos, 'last'])).type;
    }
    return null;
  }
);

const makeCardsSelector = () => createSelector(
  [posSelector, makeHandSelector(), makeMyPosSelector(), makeLineupSelector()],
  (pos, hand, myPos, lineupImmu) => {
    // Note: meaning of card numbers
    //  * -1 stands for back side of cards,
    //  * null stands for no card
    //  * > 0  stands for normal cards

    if (pos === -1 || !hand || !hand.get('lineup')) {
      return [null, null];
    }

    if (pos === myPos && hand.get('holeCards')) {
      return hand.get('holeCards').toJS();
    }

    const lineup = lineupImmu.toJS();
    const state = hand.get('state');

    // Note: no players should have cards shown on table if it's still waiting
    // and show his cards only if he is an active player
    // except in showdown, when cards should always be shown
    if (state === 'waiting' || (state !== 'showdown' && !pokerHelper.isActivePlayer(lineup, pos, hand.get('state')))) {
      return [null, null];
    }

    return (hand.get('lineup').toJS()[pos].cards) ? hand.get('lineup').toJS()[pos].cards : [-1, -1];
  }
);

const makeOpenSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? (lineup.toJS()[pos].address.indexOf('0x0000000000000000000000000000000000000000') > -1) : false
);

const makeSitoutSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos !== undefined && lineup.getIn([pos, 'sitout']))
);

const makePendingSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1 && lineup.toJS()[pos]) ? lineup.toJS()[pos].pending : false
);

const makeMyPendingSelector = () => createSelector(
  [makeLineupSelector(), makeSignerAddrSelector()],
  (lineup, signerAddr) => {
    if (lineup && lineup.toJS) {
      return lineup.toJS().some((l) => l.pending && l.pending.signerAddr === signerAddr);
    }
    return false;
  }
);

const makeDealerSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get) ? hand.get('dealer') : -1
);

const makeMyCardsSelector = () => createSelector(
  makeHandSelector(),
  (hand) => (hand && hand.get('holeCards')) ? hand.get('holeCards').toJS() : [-1, -1]
);

const makeFoldedSelector = () => createSelector(
    makeLastReceiptSelector(),
    (lastReceipt) => (lastReceipt && lastReceipt.type) ? lastReceipt.type === Type.FOLD : false
);

const makeCoordsSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? getPosCoords(SEAT_COORDS, lineup.size, pos) : null
);

const makeAmountCoordsSelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? AMOUNT_COORDS[pos] : null
);

const makeBlockySelector = () => createSelector(
  [makeLineupSelector(), posSelector],
  (lineup, pos) => (lineup && pos > -1) ? createBlocky(lineup.getIn([pos, 'address'])) : ''
);

const makeStackSelector = () => createSelector(
  [tableStateSelector, posSelector],
  selectStack
);

const makeStandingUpSelector = () => createSelector(
  [makeSeatSelector()],
  (seat) => seat && seat.get('exitHand') !== undefined
);

const makeSeatStatusSelector = () => createSelector(
  [makeHandSelector(), makeLastActionSelector(), makeLastReceiptSelector(),
    posSelector, makePendingSelector(), makeStandingUpSelector()],
  (hand, lastAction, lastReceipt, pos, pending, standingUp) => {
    const lineup = hand.get('lineup').toJS();
    // player is joining the table
    if (pending) {
      return STATUS_MSG.sittingIn;
    }
    // player is leaving the table
    if (standingUp) {
      return STATUS_MSG.standingUp;
    }
    // player is in sitout
    if (typeof lineup[pos].sitout === 'number') {
      return STATUS_MSG.sitOut;
    }
    // player is returning from sitOut
    if (lastAction === Type.SIT_OUT && !lineup[pos].sitout) {
      return STATUS_MSG.sittingIn;
    }
    // player is sitting at table playing
    if (lastReceipt && lastReceipt.handId >= 0) {
      return STATUS_MSG.active;
    }
    return STATUS_MSG.waiting;
  }
);

const makeShowStatusSelector = () => createSelector(
  [tableStateSelector, makeHandSelector(), makeLastActionSelector(), makeLastRoundMaxBetSelector(), makeLastReceiptSelector(), makeSbSelector(), posSelector],
  (table, hand, lastAction, lastRoundMaxBet, lastReceipt, sb, pos) => {
    if (lastAction && lastReceipt && hand && hand.get) {
      const amount = lastReceipt.amount.toNumber();
      const state = hand.get('state');
      const lineup = hand.get('lineup').toJS();
      if (hand.get('state') === 'preflop') {
        const dealer = hand.get('dealer');
        let sbPos;
        let bbPos;
        try {
          sbPos = pokerHelper.getSbPos(lineup, dealer, state);
        } catch (e) {
          sbPos = undefined;
        }
        try {
          bbPos = pokerHelper.getBbPos(lineup, dealer, state);
        } catch (e) {
          bbPos = undefined;
        }
        if (pos === sbPos && amount === sb) {
          return STATUS_MSG.blindSmall;
        }

        if (pos === bbPos && amount === sb * 2) {
          return STATUS_MSG.blindBig;
        }
      }
      if (lastAction === Type.FOLD) {
        return STATUS_MSG.fold;
      }
      if (state !== 'waiting' && state !== 'dealing') {
        if (lastAction === Type.BET) {
          // trying to find the previous player here
          // 1. reverse the lineup
          const reverseLineup = hand.get('lineup').reverse().toJS();
          // 2. calc same pos in reverse lineup
          const reversePos = (lineup.length - 1) - pos;
          // 3. use nexPlayer() on reverse lineup to get previous player
          let prevPos;
          try {
            prevPos = pokerHelper.nextPlayer(reverseLineup, reversePos, 'active', state);
          } catch (err) {
            // sometimes the lineup has only one player left (fold heads up)
            // then we try to find that guy to compare values
            prevPos = pokerHelper.nextPlayer(reverseLineup, reversePos, 'involved', state);
          }

          const prevAmount = (lineup[prevPos].last) ? rc.get(lineup[prevPos].last).amount.toNumber() : 0;
          // bet: amount higher than previous player && previous player amount <= lastRoundMaxBet
          if (amount > prevAmount && prevAmount <= lastRoundMaxBet) {
            return STATUS_MSG.bet;
          }
          // all-in: stack is zero
          const stack = selectStack(table, pos);
          if (stack === 0) {
            return STATUS_MSG.allIn;
          }
          // call: amount same as previous player
          if (amount === prevAmount) {
            return STATUS_MSG.call;
          }
          // raise: amount higher than previous player
          if (amount > prevAmount) {
            return STATUS_MSG.raise;
          }
        }
        /* eslint-disable no-nested-ternary */
        const checkType = (state === 'preflop') ?
          Type.CHECK_PRE : (state === 'flop') ?
            Type.CHECK_FLOP : (state === 'turn') ?
              Type.CHECK_TURN : Type.CHECK_RIVER;
        /* eslint-enable no-nested-ternary */
        if (lastAction === checkType) {
          return STATUS_MSG.check;
        }
      }
    }
    return {};
  }
);

const makeMyStackSelector = () => createSelector(
  [tableStateSelector, makeMyPosSelector()],
  selectStack
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
  // const addr = table.getIn(['data', 'seats', pos, 'address']);
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
  if (maxHand === 0 || maxHand <= lastHandNetted) {
    return amount;
  }
  // sum up state channel
  for (let i = lastHandNetted + 1; i <= maxHand; i += 1) {
    // get all the bets
    const rec = table.getIn([i.toString(), 'lineup', pos, 'last']);
    const bet = (rec) ? rc.get(rec).amount.toNumber() : 0;
    if (bet) {
      amount -= bet;
    }
    // get all the winnings
    const distsRec = table.getIn([i.toString(), 'distribution']);
    if (distsRec) {
      const dist = rc.get(distsRec);
      if (dist.outs[pos]) {
        amount += dist.outs[pos].toNumber();
      }
    }
  }
  return amount;
};

export {
  posSelector,
  makeSeatSelector,
  makeLastReceiptSelector,
  makeSitoutSelector,
  makeLastAmountSelector,
  makeDealerSelector,
  makePendingSelector,
  makeMyPendingSelector,
  makeOpenSelector,
  makeCoordsSelector,
  makeAmountCoordsSelector,
  makeBlockySelector,
  makeCardsSelector,
  makeLastRoundMaxBetSelector,
  makeShowStatusSelector,
  makeMyCardsSelector,
  makeFoldedSelector,
  makeWhosTurnSelector,
  makeMyStackSelector,
  makeStackSelector,
  makeLastActionSelector,
  makeSeatStatusSelector,
  makeStandingUpSelector,
};
