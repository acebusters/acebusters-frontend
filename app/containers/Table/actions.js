/**
 * Created by helge on 20.09.16.
 */

export const START_POLLING = 'START_POLLING';
export const COMPLETE_HAND_QUERY = 'COMPLETE_HAND_QUERY';
export const HAND_REQUEST = 'HAND_REQUEST';
export const NEXT_HAND = 'NEXT_HAND';
export const SET_CARDS = 'SET_CARDS';
export const RESIZE_TABLE = 'RESIZE_TABLE';
export const TABLE_RECEIVED = 'TABLE_RECEIVED';
export const UPDATE_RECEIVED = 'UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'LINEUP_RECEIVED';
export const PROCESS_NETTING = 'PROCESS_NETTING';
export const LEAVE_REQUEST = 'LEAVE_REQUEST';
export const PERFORM_SHOW = 'PERFORM_SHOW';
export const PERFORM_DEALING_ACTION = 'PERFORM_DEALING_ACTION';

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

export function resizeTable(computedStyles, tableAddr) {
  return { type: RESIZE_TABLE, computedStyles, tableAddr };
}

export function tableReceived(tableAddr) {
  return { type: TABLE_RECEIVED, tableAddr };
}

export function performShow(table, handId, amount, holeCards) {
  return { type: PERFORM_SHOW, table, handId, amount, holeCards };
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

export function processNetting(tableAddr, netRequest, handId, privKey) {
  return { type: PROCESS_NETTING, tableAddr, netRequest, handId, privKey };
}

export function leaveRequest(tableAddr, handId, amount, privKey) {
  return { type: LEAVE_REQUEST, tableAddr, handId, amount, privKey };
}
