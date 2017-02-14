/**
 * Created by helge on 20.09.16.
 */
import _ from 'lodash';
import { fromJS, List } from 'immutable';
import EWT from 'ethereum-web-token';
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import * as TableActions from './actions';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// The initial application state
export const initialState = fromJS({
  hand: {
    cards: [],
    dealer: 0,
    distribution: '',
    handId: 0,
    lineup: [],
    state: '',
  },
  complete: false,
});


function getMyAddress(privKey) {
  const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
  return `0x${EthUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
}


export default function tableReducer(state = initialState, action) {
  const update = {};
  let myPos;
  switch (action.type) {
    case TableActions.LINEUP_RECEIVED: {
      let lineup = List([]);
      for (let i = 0; i < action.lineup[1].length; i += 1) {
        let temp = fromJS({
          address: action.lineup[1][i],
          amount: action.lineup[2][i].toNumber(),
        });

        if (state.get('hand').get('lineup').size > 0) {
          temp = state.merge(state.get('hand').get('lineup').get(i), lineup.get(i));
        }

        lineup = lineup.push(temp);
      }

      const newHand = state.get('hand').set('lineup', lineup);

      return state
        .set('lastHandNettedOnClient', action.lineup[0].toNumber())
        .set('hand', newHand);
    }

    case TableActions.SET_CARDS: {
      update.hand = _.clone(state.hand);
      if (action.cards) {
        update.hand.lineup[action.pos].cards = action.cards;
      }
      return (!update) ? state : Object.assign({}, state, update);
    }

    case TableActions.UPDATE_AMOUNT: {
      return state.set('amount', action.amount);
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
      update.hand = _.clone(state.get('hand').toJS());
      const newState = state.toJS();
      if (handComplete && newState.hand.handId === action.tableState.handId) {
        update.complete = handComplete;
        update.hand.lineup.forEach((player) => {
          delete player.last; // eslint-disable-line
        });
        update.hand.handId = action.tableState.handId + 1;
      } else if (!newState.hand || !newState.hand.handId || newState.hand.handId <= action.tableState.handId) {
        _.merge(update.hand.lineup, action.tableState.lineup);
        update.lastRoundMaxBet = (newState.lastRoundMaxBet) ? newState.lastRoundMaxBet : 0;
        if (newState.hand && newState.hand.state && action.tableState.state !== newState.hand.state && action.tableState.state !== 'dealing') {
          const maxBet = pokerHelper.findMaxBet(action.tableState.lineup, action.tableState.dealer).amount;
          update.lastRoundMaxBet = maxBet;
        }

        update.hand.handId = action.tableState.handId;
        update.hand.dealer = action.tableState.dealer;
        update.hand.cards = action.tableState.cards;
        update.hand.state = action.tableState.state;
      } else {
        return fromJS(newState);
      }
      return fromJS(update);
    }

    case TableActions.NEXT_HAND: {
      const currentDealer = state.get('hand').get('dealer');
      const currentLineup = state.get('hand').get('lineup').toJS();
      const newLineup = currentLineup.map((player) => {
        delete player.cards; // eslint-disable-line
        return player;
      });

      const newHand = fromJS({
        cards: [],
        distribution: '',
        dealer: currentDealer + 1,
        state: 'dealing',
        lineup: newLineup,
      });

      return state
        .set('lastRoundMaxBet', 0)
        .delete('complete')
        .delete('performedDealing')
        .set('hand', newHand);
    }


    default:
      return state;
  }
}
