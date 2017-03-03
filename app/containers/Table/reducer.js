/**
 * Created by helge on 20.09.16.
 */
import { Map, List, fromJS } from 'immutable';
import EWT from 'ethereum-web-token';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import * as TableActions from './actions';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// Expecting a structure of the state like this:
  // [tableAddr]: {
  //   handId: 0,
  //   state: '',
  //   cards: [],
  //   holeCards: [],
  //   lastRoundMaxBet: 0,
  //   distribution: '',
  //   dealer: 0,
  //   lineup: [],
  //   amounts: [],
  // },
  // modalStack: [],
  //

// The initial application state
export const initialState = fromJS({ modalStack: [] });

export default function tableReducer(state = initialState, action) {
  switch (action.type) {
    // LINEUP_RECEIVED action is received from the contract.
    // It is only needed to initialize the state.
    case TableActions.LINEUP_RECEIVED: {
      const current = state.getIn([action.tableAddr, 'lineup']);
      // if we have a lineup state already, do nothing
      if (current && current.length) {
        return state;
      }

      // if we don't have a lineup, let's build it
      let newState = state;
      let lineup = List([]);
      let amounts = List([]);

      for (let i = 0; i < action.lineup[1].length; i += 1) {
        lineup = lineup.push(Map({
          address: action.lineup[1][i],
        }));
        amounts = amounts.push(action.lineup[2][i].toNumber());
        // newState = newState.setIn([action.tableAddr, 'lineup', i], );
        // newState = newState.setIn([action.tableAddr, 'amounts', i], action.lineup[2][i].toNumber());
      }
      newState = newState.setIn([action.tableAddr, 'lineup'], lineup);
      newState = newState.setIn([action.tableAddr, 'amounts'], amounts);
      newState = newState.setIn([action.tableAddr, 'lastHandNettedOnClient'], action.lineup[0].toNumber());
      return newState;
    }

    case TableActions.SET_CARDS: {
      return state.setIn([action.tableAddr, 'holeCards'], action.cards);
    }

    case TableActions.UPDATE_AMOUNT: {
      return state.set('amount', action.amount);
    }

    case TableActions.COMPLETE_HAND_QUERY: {
      let newState = state;
      const lineup = state.getIn([action.tableAddr, 'lineup']);
      action.hand.lineup.forEach((player) => {
        const lastReceipt = rc.get(player.last);
        for (let i = 0; i < lineup.size; i += 1) {
          if (lineup.getIn([i, 'address']) === lastReceipt.signer) {
            const amount = newState.getIn([action.tableAddr, 'amounts', i]);
            newState = newState.setIn([action.tableAddr, 'amounts', i], amount - lastReceipt.values[1]);
          }
        }
      });
      const dists = rc.get(action.hand.distribution);
      for (let j = 0; j < dists.values[2].length; j += 1) {
        const dist = EWT.separate(dists.values[2][j]);
        for (let i = 0; i < lineup.size; i += 1) {
          if (lineup.getIn([i, 'address']) === dist.address) {
            const amount = newState.getIn([action.tableAddr, 'amounts', i]);
            newState = newState.setIn([action.tableAddr, 'amounts', i], amount + dist.amount);
          }
        }
      }
      return newState.setIn([action.tableAddr, 'lastHandNettedOnClient'], action.hand.handId);
    }
    case TableActions.COMPLETE_BET: {
      return state.setIn([action.tableAddr, 'holeCards'], List(action.holeCards));
    }
    case TableActions.COMPLETE_FOLD: {
      return state;
    }
    case TableActions.COMPLETE_SHOW: {
      return state.set('showed', true);
    }

    case TableActions.ADD_TO_MODAL: {
      const newStack = state.get('modalStack').slice();
      newStack.push(action.node);
      return state
        .set('modalStack', newStack);
    }

    case TableActions.DISMISS_FROM_MODAL: {
      const newStack = state.get('modalStack').slice();
      newStack.pop();
      return state
        .set('modalStack', newStack);
    }

    case TableActions.UPDATE_RECEIVED: {
      const hand = state.get(action.tableAddr);

      // if we did not have any state, or we had an old hand, get all new
      if (!hand || hand.get('handId') === undefined ||
        hand.get('handId') < action.hand.handId) {
        return state
          .setIn([action.tableAddr, 'handId'], action.hand.handId)
          .setIn([action.tableAddr, 'dealer'], action.hand.dealer)
          .setIn([action.tableAddr, 'state'], action.hand.state);
      }

      // if we are still playing the same hand, check if there is anything we should update
      if (hand.get('handId') === action.hand.handId) {
        let newState = state;

        // update lineups if any of the receipts changed
        if (action.hand.lineup) {
          for (let j = 0; j < action.hand.lineup.length; j += 1) {
            if (state.getIn([action.tableAddr, 'lineup', j, 'last']) !== action.hand.lineup[j].last) {
              newState = newState.setIn([action.tableAddr, 'lineup', j], Map(action.hand.lineup[j]));
            }
          }
        }

        // if the hand state changed, make sure to update it
        if (state.getIn([action.tableAddr, 'state']) !== action.hand.state) {
          newState = newState.setIn([action.tableAddr, 'state'], action.hand.state);
          if (action.hand.cards && action.hand.cards.length > 0) {
            newState = newState.setIn([action.tableAddr, 'cards'], List(action.hand.cards));
          }
          if (action.hand.distribution) {
            newState = newState.setIn([action.tableAddr, 'distribution'], action.hand.distribution);
          }

          // in any state but dealing, update maxBet
          if (action.hand.state !== 'dealing') {
            const maxBet = pokerHelper.findMaxBet(action.hand.lineup, action.hand.dealer).amount;
            newState = newState.setIn([action.tableAddr, 'lastRoundMaxBet'], maxBet);
          }
        }
        return newState;
      }

      // TODO: handle new hand in saga

      // default, just return state
      return state;
    }

    // case TableActions.NEXT_HAND: {
    //   const currentDealer = state.get('hand').dealer;
    //   const currentLineup = state.get('hand').lineup;
    //   const newHand = null;// TODO fix _.clone(state.get('hand'));
    //   const newLineup = currentLineup.map((player) => {
    //     delete player.cards; // eslint-disable-line
    //     return player;
    //   });
    //   newHand.lineup = newLineup;
    //   newHand.state = 'dealing';
    //   newHand.cards = [];
    //   newHand.dealer = currentDealer + 1;
    //   return state
    //     .set('lastRoundMaxBet', 0)
    //     .set('complete', false)
    //     .set('performedDealing', false)
    //     .set('hand', newHand);


      // we start a new hand here:
      // - delete all the last receipts in the lineup

      // - increment handId and reset lastRoundMaxBet
      // const handId = state.getIn([action.tableAddr, 'handId']);
      // if (handComplete && handId === action.hand.handId) {
      //   let newState = state;
      //   // delete all the last receipts in the lineup
      //   for (let j = 0; j < action.hand.length; j += 1) {
      //     newState = state.deleteIn([action.tableAddr, 'lineup', j], 'last');
      //   }
      //   // increment handId and reset lastRoundMaxBet
      //   return newState
      //     .setIn([action.tableAddr, 'handId'], action.hand.handId + 1)
      //     .setIn([action.tableAddr, 'lastRoundMaxBet'], 0);
      // }
    // }

    default:
      return state;
  }
}
