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
export const JOIN_TABLE = 'JOIN_TABLE';
export const BET = 'acebusters/Table/BET';
export const SHOW = 'acebusters/Table/SHOW';
export const ADD_PENDING = 'ADD_PENDING';

export function completeHandQuery(tableAddr, hand) {
  return { type: COMPLETE_HAND_QUERY, tableAddr, hand };
}

export function handRequest(tableAddr, handId) {
  return { type: HAND_REQUEST, tableAddr, handId };
}

export function setCards(tableAddr, handId, cards, pos) {
  return { type: SET_CARDS, tableAddr, handId, cards, pos };
}

export function bet(tableAddr, handId, amount, privKey) {
  return { type: BET, tableAddr, handId, amount, privKey };
}

export function show(tableAddr, handId, amount, privKey) {
  return { type: SHOW, tableAddr, handId, amount, privKey };
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

export function addPending(tableAddr, hand, pos) {
  return { type: ADD_PENDING, tableAddr, hand, pos };
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
