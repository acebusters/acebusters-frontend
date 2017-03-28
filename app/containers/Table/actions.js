/**
 * Created by helge on 20.09.16.
 */

export const HAND_REQUEST = 'acebusters/Table/HAND_REQUEST';
export const NEXT_HAND = 'acebusters/Table/NEXT_HAND';
export const SET_CARDS = 'acebusters/Table/SET_CARDS';
export const RESIZE_TABLE = 'acebusters/Table/RESIZE_TABLE';
export const TABLE_RECEIVED = 'acebusters/Table/TABLE_RECEIVED';
export const UPDATE_RECEIVED = 'acebusters/Table/UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'acebusters/Table/LINEUP_RECEIVED';
export const LEAVE_REQUEST = 'acebusters/Table/LEAVE_REQUEST';
export const JOIN_TABLE = 'acebusters/Table/JOIN_TABLE';
export const BET = 'acebusters/Table/BET';
export const SHOW = 'acebusters/Table/SHOW';
export const NET = 'acebusters/Table/NET';
export const PENDING_TOGGLE = 'acebusters/Table/PENDING_TOGGLE';


export function setCards(tableAddr, handId, cards, pos) {
  return { type: SET_CARDS, tableAddr, handId, cards, pos };
}

export function bet(tableAddr, handId, amount, privKey) {
  return { type: BET, tableAddr, handId, amount, privKey };
}

export function show(tableAddr, handId, holeCards, amount, privKey) {
  return { type: SHOW, tableAddr, handId, holeCards, amount, privKey };
}

export function net(tableAddr, handId, balances, privKey) {
  return { type: NET, tableAddr, handId, balances, privKey };
}

export function handRequest(tableAddr, handId) {
  return { type: HAND_REQUEST, tableAddr, handId };
}

export function tableReceived(tableAddr) {
  return { type: TABLE_RECEIVED, tableAddr };
}

export function pendingToggle(tableAddr, handId, pos) {
  return { type: PENDING_TOGGLE, tableAddr, handId, pos };
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

export function leaveRequest(tableAddr, handId, amount, privKey) {
  return { type: LEAVE_REQUEST, tableAddr, handId, amount, privKey };
}
