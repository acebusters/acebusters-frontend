/**
 * Created by helge on 20.09.16.
 */
import _ from 'lodash';

import EWT from 'ethereum-web-token';
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import * as TableActions from './actions';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

const defaultState = {};


function getMyAddress(privKey) {
  const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
  return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
}


export default function table(state = defaultState, action) {
  let update = {};
  let myPos;
  switch (action.type) {
    case TableActions.GET_LINEUP: {
      const lineup = [];
      for (let i = 0; i < action.payload[1].length; i += 1) {
        const temp = {};
        temp.address = action.payload[1][i];
        temp.amount = action.payload[2][i].toNumber();
        lineup.push(temp);
      }
      update.hand = {};
      update.hand.lineup = lineup;
      update.tableAddr = action.payload.tableAddr;
      if (state.hand && state.hand.lineup) {
        _.merge(update.hand.lineup, state.hand.lineup);
      }

      update.lastHandNettedOnClient = action.payload[0].toNumber();
      return (!update) ? state : Object.assign({}, state, update);
    }

    case TableActions.SET_CARDS: {
      update.hand = _.clone(state.hand);
      if (action.cards) {
        update.hand.lineup[action.pos].cards = action.cards;
      }
      return (!update) ? state : Object.assign({}, state, update);
    }


    case TableActions.COMPLETE_HAND_QUERY: {
      update.hand = _.clone(state.hand);
      action.hand.lineup.forEach((player) => {
        const lastReceipt = rc.get(player.last);
        for (let i = 0; i < update.hand.lineup.length; i += 1) {
          if (update.hand.lineup[i].address === lastReceipt.signer) {
            update.hand.lineup[i].amount -= lastReceipt.values[1];
          }
        }
      });
      const dists = rc.get(action.hand.distribution);
      for (let j = 0; j < dists.values[2].length; j += 1) {
        const dist = EWT.separate(dists.values[2][j]);
        for (let i = 0; i < update.hand.lineup.length; i += 1) {
          if (update.hand.lineup[i].address === dist.address) {
            update.hand.lineup[i].amount += dist.amount;
          }
        }
      }
      update.lastHandNettedOnClient = action.hand.handId;
      return (!update) ? state : Object.assign({}, state, update);
    }


    case TableActions.COMPLETE_BET: {
      myPos = pokerHelper.getMyPos(state.hand.lineup, getMyAddress(action.privKey));
      const obj = _.clone(state);
      if (action.holeCards.cards) { obj.hand.lineup[myPos].cards = action.holeCards.cards; }
      return obj;
    }


    case TableActions.COMPLETE_FOLD: {
      return (!update) ? state : Object.assign({}, state, update);
    }

    case TableActions.COMPLETE_SHOW: {
      update.showed = true;
      return (!update) ? state : Object.assign({}, state, update);
    }


    case TableActions.SEATED: {
      if (action.payload.seatedAt > -1) {
        update.mySeat = action.payload.seatedAt;
      }
      return (!update) ? state : Object.assign({}, state, update);
    }


    case TableActions.STARTED_REQUEST: {
      update.requestInProgress = true;
      return (!update) ? state : Object.assign({}, state, update);
    }


    case TableActions.PERFORM_DEALING_ACTION: {
      update.lineup = _.clone(state.lineup);
      update.performedDealing = true;
      return (!update) ? state : Object.assign({}, state, update);
    }

    // Error Handling
    case TableActions.FAILED_REQUEST: {
      const error = action.error;
      update.requestInProgress = false;
      update.error = error;
      return (!update) ? state : Object.assign({}, state, update);
    }

    case TableActions.UPDATE_RECEIVED: {
      // handComplete stays true till SB posted to server
      const handComplete = pokerHelper.checkForNextHand(action.tableState);
      update.hand = _.clone(state.hand);
      if (handComplete && state.hand.handId === action.tableState.handId) {
        update.complete = handComplete;
        update.hand.lineup.forEach((player) => {
          delete player.last; // eslint-disable-line
        });
        update.hand.handId = action.tableState.handId + 1;
      } else if (!state.hand || !state.hand.handId || state.hand.handId <= action.tableState.handId) {
        _.merge(update.hand.lineup, action.tableState.lineup);
        update.lastRoundMaxBet = (state.lastRoundMaxBet) ? state.lastRoundMaxBet : 0;
        if (state.hand && state.hand.state && action.tableState.state !== state.hand.state && action.tableState.state !== 'dealing') {
          const maxBet = pokerHelper.findMaxBet(action.tableState.lineup, action.tableState.dealer).amount;
          update.lastRoundMaxBet = maxBet;
        }

        update.hand.handId = action.tableState.handId;
        update.hand.dealer = action.tableState.dealer;
        update.hand.cards = action.tableState.cards;
        update.hand.state = action.tableState.state;
      } else {
        return state;
      }
      return Object.assign({}, state, update);
    }


    case TableActions.NEXT_HAND: {
      update = _.clone(state);
      update.hand.dealer = state.hand.dealer + 1;
      update.hand.state = 'dealing';
      update.lastRoundMaxBet = 0;
      delete update.hand.cards;
      delete update.complete;
      delete update.performedDealing;
      delete state.complete; // eslint-disable-line
      update.hand.lineup.forEach((player) => {
        delete player.cards;  // eslint-disable-line
      });
      return (!update) ? state : Object.assign({}, state, update);
    }


    default:
      return state;
  }
}
