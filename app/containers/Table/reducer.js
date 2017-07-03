/**
 * Created by helge on 20.09.16.
 */
import { Map, List, fromJS } from 'immutable';
import * as TableActions from './actions';
import * as storageService from '../../services/localStorage';
import { createBlocky } from '../../services/blockies';

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

    case TableActions.ADD_MESSAGE: {
      const message = {
        message: action.message,
        signer: action.privKey,
        created: action.created,
      };
      const newState = state.updateIn([action.tableAddr, 'messages'], (list) => list.push(message));
      storageService.setItem(`messages${action.tableAddr}`, newState.getIn([action.tableAddr, 'messages']).toJS());
      return newState;
    }

    case TableActions.TABLE_RECEIVED: {
      if (!state.get(action.tableAddr)) {
        return state.set(action.tableAddr, Map({}));
      }
      return state;
    }

    case TableActions.LINEUP_RECEIVED: {
      let lineup = List([]);
      let amounts = List([]);
      let newState = state;

      for (let i = 0; i < action.lineup[1].length; i += 1) {
        lineup = lineup.push(Map({ address: action.lineup[1][i] }));
        amounts = amounts.push(action.lineup[2][i].toNumber());
      }

      // Note: not every LINEUP_RECEIVED provide a handId param. LINEUP_RECEIVED is triggered in 2 cases:
      // 1. Lobby: LobbyItem fires LINEUP_RECEIVED when loaded
      // 2. Table: after Join Successful (table events)
      // The 2nd case will provide a handId, and we'll use it to update lineup data in 'hand'
      if (action.handId) {
        const table = state.get(action.tableAddr);
        let hand = table.get(action.handId);

        for (let j = 0; j < action.lineup.length; j += 1) {
          if (hand.getIn(['lineup', j, 'address']) !== action.lineup[1][j]) {
            const seat = { address: action.lineup[1][j] };
            if (hand.get('state') !== 'waiting') {
              seat.sitout = Math.floor(Date.now() / 1000);
            }
            hand = hand.setIn(['lineup', j], Map(seat));
          }
        }

        newState = newState.setIn([action.tableAddr, action.handId], hand);
      }

      const sb = (typeof action.smallBlind === 'object') ? action.smallBlind.toNumber() : action.smallBlind;
      return newState.setIn([action.tableAddr, 'data', 'seats'], lineup)
        .setIn([action.tableAddr, 'data', 'amounts'], amounts)
        .setIn([action.tableAddr, 'data', 'lastHandNetted'], action.lineup[0].toNumber())
        .setIn([action.tableAddr, 'data', 'smallBlind'], sb);
    }

    case TableActions.EXIT_HAND_SET: {
      const handIdStr = action.handId.toString();
      return state.setIn([action.tableAddr, handIdStr, 'lineup', action.pos, 'exitHand'], action.exitHand);
    }

    case TableActions.PENDING_SET: {
      const { payload: { handId, tableAddr, pos, data = {} } } = action;
      const path = [tableAddr, handId.toString(), 'lineup', pos, 'pending'];

      if (data.signerAddr) {
        data.blocky = createBlocky(data.signerAddr);
      }
      return state.setIn(path, fromJS(data));
    }

    case TableActions.PENDING_DROP: {
      const { payload: { handId, tableAddr, pos } } = action;
      const path = [tableAddr, handId.toString(), 'lineup', pos, 'pending'];
      return state.deleteIn(path);
    }

    case TableActions.SET_CARDS: {
      const handIdStr = action.handId.toString();
      storageService.setItem(`holeCards${action.tableAddr}${handIdStr}`, action.cards);
      return state.setIn([action.tableAddr, handIdStr, 'holeCards'], fromJS(action.cards));
    }

    case TableActions.RECEIPT_SET: {
      const handIdStr = action.handId.toString();
      return state.setIn([action.tableAddr, handIdStr, 'lineup', action.pos, 'last'], action.receipt);
    }

    case TableActions.PRE_TOGGLE_SITOUT: {
      return state.setIn([
        action.tableAddr,
        action.handId.toString(),
        'lineup',
        action.pos,
        'sitout',
      ], action.sitout);
    }

    case TableActions.sitOutToggle.FAILURE: {
      return state.setIn([
        action.tableAddr,
        action.handId.toString(),
        'lineup',
        action.pos,
        'sitout',
      ], action.sitout);
    }

    case TableActions.UPDATE_RECEIVED: {
      const table = state.get(action.tableAddr);

      // if we did not have the fetched hand, we create it in the state
      const handIdStr = action.hand.handId.toString();
      if (!table || table.get(handIdStr) === undefined) {
        let hand = Map({
          dealer: action.hand.dealer,
          state: action.hand.state,
          cards: List(action.hand.cards),
          changed: action.hand.changed,
          distribution: action.hand.distribution,
        });
        const holeCards = storageService.getItem(`holeCards${action.tableAddr}${handIdStr}`);
        if (holeCards) {
          hand = hand.set('holeCards', List(holeCards));
        }
        if (action.hand.lineup) {
          for (let j = 0; j < action.hand.lineup.length; j += 1) {
            hand = hand.set('lineup', fromJS(action.hand.lineup));
          }
        }
        let messages = storageService.getItem(`messages${action.tableAddr}`) || [];
        const min15ago = Date.now() - (60 * 15 * 1000);
        messages = messages.filter((message) => message.created > min15ago);
        return state.setIn([action.tableAddr, action.hand.handId.toString()], hand)
          .setIn([action.tableAddr, 'messages'], List(messages));
      }

      let hand = table.get(action.hand.handId.toString());
      // if the hand state changed, make sure to update it
      if (hand.get('changed') !== action.hand.changed ||
        hand.get('distribution') !== action.hand.distribution) {
        // in any state but dealing, update maxBet
        let maxBet;
        switch (action.hand.state) {
          case 'preflop': {
            maxBet = 0;
            break;
          }
          case 'flop': {
            maxBet = action.hand.preMaxBet;
            break;
          }
          case 'turn': {
            maxBet = action.hand.flopMaxBet;
            break;
          }
          case 'river': {
            maxBet = action.hand.turnMaxBet;
            break;
          }
          case 'showdown': {
            maxBet = action.hand.riverMaxBet;
            break;
          }
          default: {
            maxBet = 0;
            break;
          }
        }
        hand = hand.set('lastRoundMaxBet', maxBet);
        hand = hand.set('state', action.hand.state);
        hand = hand.set('dealer', action.hand.dealer);
        hand = hand.set('changed', action.hand.changed);
        if (action.hand.cards && action.hand.cards.length > 0) {
          hand = hand.set('cards', List(action.hand.cards));
        }
        if (action.hand.distribution) {
          hand = hand.set('distribution', action.hand.distribution);
        }
        const holeCards = storageService.getItem(`holeCards${action.tableAddr}${handIdStr}`);
        if (holeCards && !hand.get('holeCards')) {
          hand = hand.set('holeCards', List(holeCards));
        }
      }
      for (let j = 0; j < action.hand.lineup.length; j += 1) {
        if (hand.getIn(['lineup', j, 'address']) !== action.hand.lineup[j].address ||
          hand.getIn(['lineup', j, 'last']) !== action.hand.lineup[j].last ||
          hand.getIn(['lineup', j, 'sitout']) !== action.hand.lineup[j].sitout ||
          hand.getIn(['lineup', j, 'exitHand']) !== action.hand.lineup[j].exitHand) {
          hand = hand.setIn(['lineup', j], Map(action.hand.lineup[j]));
        }
      }
      if (table.get(action.hand.handId.toString()) === hand) {
        return state;
      }
      return state.setIn([action.tableAddr, action.hand.handId.toString()], hand);
    }

    default:
      return state;
  }
}
