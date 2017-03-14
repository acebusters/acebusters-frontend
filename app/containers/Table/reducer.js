/**
 * Created by helge on 20.09.16.
 */
import { Map, List, fromJS } from 'immutable';
import { PokerHelper, ReceiptCache } from 'poker-helper';
import * as TableActions from './actions';


const rc = new ReceiptCache();
const pokerHelper = new PokerHelper(rc);

// Expecting a structure of the state like this:
  // [tableAddr]: {
  //   [data]:
  //     lastHandNetted 5
  //     seats[{address: 0x}, {address: }]
  //     amounts     // at last hand netted
  //     exitHands   // hand when player intends to leave table
  //     SB
  //   [handId]: {
  //     state: '',
  //     cards: [],
  //     holeCards: [],
  //     lastRoundMaxBet: 0,
  //     distribution: '',
  //     dealer: 0,
  //     lineup: [],
  //   }
  //   [handId+1]: {}
  // },
  //
  // TODO: write selector for stack size
  //
  // table state: lastHandNetted (conract). .. ... .. currentHand
  //

// The initial application state
export const initialState = fromJS({});

export default function tableReducer(state = initialState, action) {
  switch (action.type) {

    case TableActions.TABLE_RECEIVED: {
      if (!state.get(action.tableAddr)) {
        return state.set(action.tableAddr, Map({}));
      }
      return state;
    }

    case TableActions.LINEUP_RECEIVED: {
      let lineup = List([]);
      let amounts = List([]);
      for (let i = 0; i < action.lineup[1].length; i += 1) {
        lineup = lineup.push(Map({ address: action.lineup[1][i] }));
        amounts = amounts.push(action.lineup[2][i].toNumber());
      }
      return state.setIn([action.tableAddr, 'data', 'seats'], lineup)
        .setIn([action.tableAddr, 'data', 'amounts'], amounts)
        .setIn([action.tableAddr, 'data', 'lastHandNetted'], action.lineup[0].toNumber())
        .setIn([action.tableAddr, 'data', 'smallBlind'], action.smallBlind.toNumber());
    }

    case TableActions.ADD_PENDING: {
      const table = state.get(action.tableAddr);
      if (!action.handId) {
        return state
          .setIn([action.tableAddr, 'data', 'seats', action.pos, 'pending'], true);
      }
      let hand = table.get(action.handId);
      hand = hand.setIn(['lineup', action.pos, 'pending'], true);
      return state
        .setIn([action.tableAddr, action.handId], hand);
    }

    case TableActions.REMOVE_PENDING: {
      if (!action.handId) {
        return state;
      }
      const lineup = state.getIn([action.tableAddr, action.handId, 'lineup']).toJS();
      lineup.forEach((item) => {
        item.pending = false; // eslint-disable-line
      });
      return state
        .setIn([action.tableAddr, action.handId, 'lineup'], fromJS(lineup));
    }

    case TableActions.SET_CARDS: {
      return state.setIn([action.tableAddr, action.handId.toString(), 'holeCards'], action.cards);
    }

    case TableActions.RESIZE_TABLE: {
      return state.setIn([action.tableAddr, 'computedStyles'], action.computedStyles);
    }

    case TableActions.UPDATE_RECEIVED: {
      const table = state.get(action.tableAddr);

      // if we did not have the fetched hand, we create it in the state
      if (!table || table.get(action.hand.handId.toString()) === undefined) {
        let hand = Map({
          dealer: action.hand.dealer,
          state: action.hand.state,
        });
        if (action.hand.lineup) {
          for (let j = 0; j < action.hand.lineup.length; j += 1) {
            hand = hand.set('lineup', fromJS(action.hand.lineup));
          }
        }
        return state.setIn([action.tableAddr, action.hand.handId.toString()], hand);
      }

      let hand = table.get(action.hand.handId.toString());

      // if the hand state changed, make sure to update it
      if (hand.get('changed') !== action.hand.changed) {
        // in any state but dealing, update maxBet
        if (action.hand.state !== hand.get('state')) {
          const maxBet = pokerHelper.findMaxBet(action.hand.lineup, action.hand.dealer).amount;
          hand = hand.set('lastRoundMaxBet', maxBet);
        }
        hand = hand.set('state', action.hand.state);
        hand = hand.set('changed', action.hand.changed);
        if (action.hand.cards && action.hand.cards.length > 0) {
          hand = hand.set('cards', List(action.hand.cards));
        }
        for (let j = 0; j < action.hand.lineup.length; j += 1) {
          if (hand.getIn(['lineup', j, 'address']) !== action.hand.lineup[j].address ||
            hand.getIn(['lineup', j, 'last']) !== action.hand.lineup[j].last) {
            hand = hand.setIn(['lineup', j], Map(action.hand.lineup[j]));
          }
        }
        if (action.hand.distribution) {
          hand = hand.set('distribution', action.hand.distribution);
        }
      }
      if (table.get(action.hand.handId.toString()) === hand) {
        return state;
      }
      return state.setIn([action.tableAddr, action.hand.handId.toString()], hand);
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
