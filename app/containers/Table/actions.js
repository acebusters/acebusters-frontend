/**
 * Created by helge on 20.09.16.
 */


export const START_POLLING = 'START_POLLING';
export const COMPLETE_HAND_QUERY = 'COMPLETE_HAND_QUERY';
export const NEXT_HAND = 'NEXT_HAND';
export const SET_CARDS = 'SET_CARDS';
export const FAILED_REQUEST = 'FAILED_REQUEST';
export const STARTED_REQUEST = 'STARTED_REQUEST';
export const UPDATE_RECEIVED = 'UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'LINEUP_RECEIVED';
export const SMALL_BLIND_RECEIVED = 'SMALL_BLIND_RECEIVED';
export const ADD_TO_MODAL = 'ADD_TO_MODAL';
export const DISMISS_FROM_MODAL = 'DISMISS_FROM_MODAL';
export const PROCESS_NETTING = 'PROCESS_NETTING';
export const LEAVE_REQUEST = 'LEAVE_REQUEST';
export const PERFORM_DEALING_ACTION = 'PERFORM_DEALING_ACTION';
export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const SUBMIT_BET = 'SUBMIT_BET';
export const SUBMIT_FOLD = 'SUBMIT_FOLD';
export const SUBMIT_SHOW = 'SUBMIT_SHOW';
export const SUBMIT_CHECK = 'SUBMIT_CHECK';
export const COMPLETE_BET = 'COMPLETE_BET';
export const COMPLETE_FOLD = 'COMPLETE_FOLD';
export const COMPLETE_SHOW = 'COMPLETE_SHOW';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';

export function setCards(cards, pos) {
  return { type: SET_CARDS, cards, pos };
}

export function poll(tableAddr) {
  return { type: START_POLLING, tableAddr };
}


export function updateReceived(tableState) {
  return { type: UPDATE_RECEIVED, tableState };
}

export function smallBlindReceived(sb) {
  return { type: SMALL_BLIND_RECEIVED, sb };
}

export function lineupReceived(lineup, tableAddr) {
  return { type: LINEUP_RECEIVED, lineup, tableAddr };
}

export function addToModal(node) {
  console.log('Add');
  return { type: ADD_TO_MODAL, node };
}

export function processNetting(netRequest, handId, privKey, tableAddr) {
  return { type: PROCESS_NETTING, netRequest, handId, privKey, tableAddr };
}

export function leaveRequest(handId, amount, privKey, tableAddr) {
  return { type: LEAVE_REQUEST, handId, amount, privKey, tableAddr };
}

export function dissmissFromModal() {
  console.log('Dismiss');
  return { type: DISMISS_FROM_MODAL };
}

export function windowResize() {
  return { type: WINDOW_RESIZE };
}

export function updateAmount(amount) {
  return { type: UPDATE_AMOUNT, amount };
}

export function submitBet(handId, amount, privKey, tableAddr) {
  return { type: SUBMIT_BET, handId, amount, privKey, tableAddr };
}

export function completeBet(holeCards, privKey) {
  return { type: COMPLETE_BET, holeCards, privKey };
}

export function submitFold(handId, amount, privKey, tableAddr) {
  return { type: SUBMIT_FOLD, handId, amount, privKey, tableAddr };
}

export function completeFold() {
  return { type: COMPLETE_FOLD };
}

export function submitShow(handId, myMaxBet, cards, privKey, tableAddr) {
  return { type: SUBMIT_SHOW, handId, myMaxBet, cards, privKey, tableAddr };
}

export function completeShow(distribution) {
  return { type: COMPLETE_SHOW, distribution };
}

export function submitCheck(handId, myMaxBet, privKey, tableAddr, state) {
  return { type: SUBMIT_CHECK, handId, myMaxBet, privKey, tableAddr, state };
}
