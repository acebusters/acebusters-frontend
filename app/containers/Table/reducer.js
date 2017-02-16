/**
 * Created by helge on 20.09.16.
 */
import _ from 'lodash';
import { Map } from 'immutable';
import EWT from 'ethereum-web-token';
import EthUtil from 'ethereumjs-util';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import * as TableActions from './actions';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// The initial application state
export const initialState = Map({
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
      let newLineup = [];
      const currentLineup = state.getIn(['hand', 'lineup']);
      for (let i = 0; i < action.lineup[1].length; i += 1) {
        const temp = {
          address: action.lineup[1][i],
          amount: action.lineup[2][i].toNumber(),
        };
        newLineup.push(temp);
      }

      if (currentLineup) {
        newLineup = _.merge(currentLineup, newLineup);
      }

      const newHand = state.get('hand');
      newHand.lineup = newLineup;
      return state
        .set('lastHandNettedOnClient', action.lineup[0].toNumber())
        .set('hand', newHand);
    }

    case TableActions.SET_CARDS: {
      const newHand = _.clone(state.get('hand'));

      if (action.cards) {
        newHand.lineup[action.pos].cards = action.cards;
      }
      return state
        .set('hand', newHand);
    }

    case TableActions.UPDATE_AMOUNT: {
      return state.set('amount', action.amount);
    }

    case TableActions.COMPLETE_HAND_QUERY: {
      const newHand = _.clone(state.get('hand'));
      action.hand.lineup.forEach((player) => {
        const lastReceipt = rc.get(player.last);
        for (let i = 0; i < newHand.lineup.length; i += 1) {
          if (newHand.lineup[i].address === lastReceipt.signer) {
            newHand.lineup[i].amount -= lastReceipt.values[1];
          }
        }
      });
      const dists = rc.get(action.hand.distribution);
      for (let j = 0; j < dists.values[2].length; j += 1) {
        const dist = EWT.separate(dists.values[2][j]);
        for (let i = 0; i < newHand.lineup.length; i += 1) {
          if (newHand.lineup[i].address === dist.address) {
            newHand.lineup[i].amount += dist.amount;
          }
        }
      }
      return state
        .set('lastHandNettedOnClient', action.hand.handId)
        .set('hand', newHand);
    }


    case TableActions.COMPLETE_BET: {
      if (!action.holeCards.cards) return state;

      myPos = pokerHelper.getMyPos(state.get('hand').lineup, getMyAddress(action.privKey));
      const newHand = _.clone(state.get('hand'));
      newHand.lineup[myPos].cards = action.holeCards.cards;

      return state
        .set('hand', newHand);
    }

    case TableActions.COMPLETE_FOLD: {
      return state;
    }

    case TableActions.COMPLETE_SHOW: {
      update.showed = true;
      return state
        .set('showed', true);
    }


    case TableActions.STARTED_REQUEST: {
      return state
        .set('requestInProgress', true);
    }


    case TableActions.PERFORM_DEALING_ACTION: {
      return state
        .set('performedDealing', true);
    }

    // Error Handling
    case TableActions.FAILED_REQUEST: {
      return state
        .set('error', action.error)
        .set('requestInProgress', false);
    }

    case TableActions.UPDATE_RECEIVED: {
      // handComplete stays true till SB posted to server
      const handComplete = pokerHelper.checkForNextHand(action.tableState);
      const newHand = _.clone(state.get('hand'));
      let newLastRoundMaxBet = 0;
      if (handComplete && state.get('hand').handId === action.tableState.handId) {
        newHand.lineup.forEach((player) => {
          delete player.last; // eslint-disable-line
        });
        newHand.handId = action.tableState.handId + 1;
      } else if (!state.get('hand') || !state.get('hand').handId || state.get('hand').handId <= action.tableState.handId) {
        _.merge(newHand.lineup, action.tableState.lineup);
        newLastRoundMaxBet = (state.get('lastRoundMaxBet')) ? state.get('lastRoundMaxBet') : 0;
        if (state.get('hand') && state.get('hand').state && action.tableState.state !== state.get('hand').state && action.tableState.state !== 'dealing') {
          const maxBet = pokerHelper.findMaxBet(action.tableState.lineup, action.tableState.dealer).amount;
          newLastRoundMaxBet = maxBet;
        }
        newHand.handId = action.tableState.handId;
        newHand.dealer = action.tableState.dealer;
        newHand.cards = action.tableState.cards;
        newHand.state = action.tableState.state;
      } else {
        return state
          .set('complete', handComplete);
      }
      return state
        .set('complete', handComplete)
        .set('lastRoundMaxBet', newLastRoundMaxBet)
        .set('hand', newHand);
    }

    case TableActions.NEXT_HAND: {
      const currentDealer = state.get('hand').dealer;
      const currentLineup = state.get('hand').lineup;
      const newLineup = currentLineup.map((player) => {
        delete player.cards; // eslint-disable-line
        return player;
      });

      const newHand = {
        cards: [],
        distribution: '',
        dealer: currentDealer + 1,
        state: 'dealing',
        lineup: newLineup,
      };

      return state
        .set('lastRoundMaxBet', 0)
        .set('complete', false)
        .set('performedDealing', false)
        .set('hand', newHand);
    }


    default:
      return state;
  }
}
