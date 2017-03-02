/**
 * Created by helge on 20.09.16.
 */
import { Map, List } from 'immutable';
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
    dealer: null,
    distribution: '',
    handId: 0,
    lineup: [],
    state: '',
  },
  modalStack: [],
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
      newState = newState.setIn([action.tableAddr, 'lineup'], List([]));
      newState = newState.setIn([action.tableAddr, 'amounts'], List([]));
      for (let i = 0; i < action.lineup[1].length; i += 1) {
        newState = newState.setIn([action.tableAddr, 'lineup', i], Map({
          address: action.lineup[1][i],
        }));
        newState = newState.setIn([action.tableAddr, 'amounts', i], action.lineup[2][i].toNumber());
      }
      newState = newState.setIn([action.tableAddr, 'lastHandNettedOnClient'], action.lineup[0].toNumber());
      return newState;
    }

    case TableActions.TABLE_JOINED: {
      return state;
    }

    case TableActions.SET_CARDS: {
      const newHand = null;// TODO fix _.clone(state.get('hand'));

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
      if (!action.holeCards.cards) return state;

      myPos = pokerHelper.getMyPos(state.get('hand').lineup, getMyAddress(action.privKey));
      const newHand = null;// TODO fix _.clone(state.get('hand'));
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
      const hand = state.get(action.tableAddr);
      const handComplete = pokerHelper.checkForNextHand(action.tableState);

      // if we did not have any state, or we had an old hand, get all new
      if (!hand ||
        hand.get('handId') === undefined ||
        hand.get('handId') < action.tableState.handId) {
        return state
          .setIn([action.tableAddr, 'lineup'], List(action.tableState.lineup))
          .setIn([action.tableAddr, 'handId'], action.tableState.handId)
          .setIn([action.tableAddr, 'dealer'], action.tableState.dealer)
          .setIn([action.tableAddr, 'state'], action.tableState.state);
      }

      // if we are still playing the same hand, check if there is anything we should update
      if (hand.get('handId') === action.tableState.handId && !handComplete) {
        let newState = state;

        // update lineups if any of the receipts changed
        for (let j = 0; j < action.tableState.lineup.length; j += 1) {
          if (state.getIn([action.tableAddr, 'lineup', j, 'last']) !== action.tableState.lineup[j].last) {
            newState = newState.setIn([action.tableAddr, 'lineup', j], Map(action.tableState.lineup[j]));
          }
        }

        // if the hand state changed, make sure to update it
        if (state.getIn([action.tableAddr, 'state']) !== action.tableState.state) {
          newState = newState.setIn([action.tableAddr, 'state'], action.tableState.state);
          if (action.tableState.cards && action.tableState.cards.length > 0) {
            newState = newState.setIn([action.tableAddr, 'cards'], List(action.tableState.cards));
          }
          if (action.tableState.distribution) {
            newState = newState.setIn([action.tableAddr, 'distribution'], action.tableState.distribution);
          }

          // in any state but dealing, update maxBet
          if (action.tableState.state !== 'dealing') {
            const maxBet = pokerHelper.findMaxBet(action.tableState.lineup, action.tableState.dealer).amount;
            newState = newState.setIn([action.tableAddr, 'lastRoundMaxBet'], maxBet);
          }
        }
        return newState;
      }

      // we start a new hand here:
      // - delete all the last receipts in the lineup
      // - increment handId
      const handId = state.getIn([action.tableAddr], 'handId');
      if (handComplete && handId === action.tableState.handId) {
        let newState = state;
        // delete all the last receipts in the lineup
        for (let j = 0; j < action.tableState.length; j += 1) {
          newState = state.deleteIn([action.tableAddr, 'lineup', j], 'last');
        }
        // increment handId
        return newState.setIn([action.tableAddr, 'handId'], action.tableState.handId + 1);
      }

      // default, just return state
      return state;
    }

    case TableActions.NEXT_HAND: {
      const currentDealer = state.get('hand').dealer;
      const currentLineup = state.get('hand').lineup;
      const newHand = null;// TODO fix _.clone(state.get('hand'));
      const newLineup = currentLineup.map((player) => {
        delete player.cards; // eslint-disable-line
        return player;
      });
      newHand.lineup = newLineup;
      newHand.state = 'dealing';
      newHand.cards = [];
      newHand.dealer = currentDealer + 1;
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
