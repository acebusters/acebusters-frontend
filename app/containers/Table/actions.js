/**
 * Created by helge on 20.09.16.
 */

export const START_POLLING = 'START_POLLING';
export const COMPLETE_HAND_QUERY = 'COMPLETE_HAND_QUERY';
export const HAND_REQUEST = 'HAND_REQUEST';
export const NEXT_HAND = 'NEXT_HAND';
export const SET_CARDS = 'SET_CARDS';
export const UPDATE_RECEIVED = 'UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'LINEUP_RECEIVED';
export const ADD_TO_MODAL = 'ADD_TO_MODAL';
export const DISMISS_FROM_MODAL = 'DISMISS_FROM_MODAL';
export const PROCESS_NETTING = 'PROCESS_NETTING';
export const LEAVE_REQUEST = 'LEAVE_REQUEST';
export const JOIN_TABLE = 'JOIN_TABLE';
export const JOIN_APPROVED = 'JOIN_APPROVED';
export const PERFORM_DEALING_ACTION = 'PERFORM_DEALING_ACTION';
export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const SUBMIT_BET = 'SUBMIT_BET';
export const SUBMIT_FOLD = 'SUBMIT_FOLD';
export const SUBMIT_SHOW = 'SUBMIT_SHOW';
export const SUBMIT_CHECK = 'SUBMIT_CHECK';
export const COMPLETE_BET = 'COMPLETE_BET';
export const COMPLETE_FOLD = 'COMPLETE_FOLD';
export const COMPLETE_SHOW = 'COMPLETE_SHOW';

export function completeHandQuery(tableAddr, hand) {
  return { type: COMPLETE_HAND_QUERY, tableAddr, hand };
}

export function handRequest(tableAddr, handId) {
  return { type: HAND_REQUEST, tableAddr, handId };
}

export function setCards(tableAddr, handId, cards, pos) {
  return { type: SET_CARDS, tableAddr, handId, cards, pos };
}

export function poll(tableAddr) {
  return { type: START_POLLING, tableAddr };
}


export function updateReceived(tableAddr, hand) {
  return { type: UPDATE_RECEIVED, tableAddr, hand };
}

export function lineupReceived(tableAddr, lineup, smallBlind) {
  return { type: LINEUP_RECEIVED, tableAddr, lineup, smallBlind };
}

export function nextHand(tableAddr, handId) {
  return { type: NEXT_HAND, tableAddr, handId };
}

export function addToModal(node) {
  return { type: ADD_TO_MODAL, node };
}

export function processNetting(tableAddr, netRequest, handId, privKey) {
  return { type: PROCESS_NETTING, tableAddr, netRequest, handId, privKey };
}

export function leaveRequest(tableAddr, handId, amount, privKey) {
  return { type: LEAVE_REQUEST, tableAddr, handId, amount, privKey };
}

export function dissmissFromModal() {
  return { type: DISMISS_FROM_MODAL };
}

export function updateAmount(tableAddr, amount) {
  return { type: UPDATE_AMOUNT, tableAddr, amount };
}

export function submitBet(tableAddr, handId, amount, privKey) {
  return { type: SUBMIT_BET, tableAddr, handId, amount, privKey };
}

export function completeBet(tableAddr, handId, holeCards) {
  return { type: COMPLETE_BET, tableAddr, handId, holeCards };
}

export function submitFold(tableAddr, handId, amount, privKey) {
  return { type: SUBMIT_FOLD, tableAddr, handId, amount, privKey };
}

export function completeFold() {
  return { type: COMPLETE_FOLD };
}

export function submitShow(tableAddr, handId, myMaxBet, cards, privKey) {
  return { type: SUBMIT_SHOW, tableAddr, handId, myMaxBet, cards, privKey };
}

export function completeShow(distribution) {
  return { type: COMPLETE_SHOW, distribution };
}

export function submitCheck(tableAddr, handId, myMaxBet, privKey, state) {
  return { type: SUBMIT_CHECK, tableAddr, handId, myMaxBet, privKey, state };
}
