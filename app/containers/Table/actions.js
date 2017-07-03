import { createFormAction } from '../../services/reduxFormSaga';

export const HAND_REQUEST = 'acebusters/Table/HAND_REQUEST';
export const NEXT_HAND = 'acebusters/Table/NEXT_HAND';
export const SET_CARDS = 'acebusters/Table/SET_CARDS';
export const RESIZE_TABLE = 'acebusters/Table/RESIZE_TABLE';
export const TABLE_RECEIVED = 'acebusters/Table/TABLE_RECEIVED';
export const UPDATE_RECEIVED = 'acebusters/Table/UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'acebusters/Table/LINEUP_RECEIVED';
export const LEAVE_REQUEST = 'acebusters/Table/LEAVE_REQUEST';
export const JOIN_TABLE = 'acebusters/Table/JOIN_TABLE';
export const PRE_TOGGLE_SITOUT = 'acebusters/Table/PRE_TOGGLE_SITOUT';
export const BET = 'acebusters/Table/BET';
export const FOLD = 'acebusters/Table/FOLD';
export const CHECK = 'acebusters/Table/CHECK';
export const SHOW = 'acebusters/Table/SHOW';
export const NET = 'acebusters/Table/NET';
export const PENDING_SET = 'acebusters/Table/PENDING_SET';
export const PENDING_DROP = 'acebusters/Table/PENDING_DROP';
export const EXIT_HAND_SET = 'acebusters/Table/EXIT_HAND_SET';
export const RECEIPT_SET = 'acebusters/Table/RECEIPT_SET';
export const ADD_MESSAGE = 'acebusters/Chat/ADD_MESSAGE';
export const SEND_MESSAGE = 'acebusters/Chat/SEND_MESSAGE';


export function setCards(tableAddr, handId, cards) {
  return { type: SET_CARDS, tableAddr, handId, cards };
}

export const pay = createFormAction('PAY');

export const sitOutToggle = createFormAction('SITOUT_TOGGLE');

export function preToggleSitout(payload) {
  return { type: PRE_TOGGLE_SITOUT, ...payload };
}

export function bet(tableAddr, handId, amount, privKey, pos, prevReceipt, extra = {}) {
  return { type: BET, tableAddr, handId, amount, privKey, pos, prevReceipt, ...extra };
}

export function fold(tableAddr, handId, amount, privKey, pos, prevReceipt) {
  return { type: FOLD, tableAddr, handId, amount, privKey, pos, prevReceipt };
}

export function check(tableAddr, handId, amount, privKey, pos, prevReceipt, checkType) {
  return { type: CHECK, tableAddr, handId, amount, privKey, pos, prevReceipt, checkType };
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

export function setPending(tableAddr, handId, pos, data = {}) {
  return { type: PENDING_SET, payload: { tableAddr, handId, pos, data } };
}

export function dropPending(tableAddr, handId, pos) {
  return { type: PENDING_DROP, payload: { tableAddr, handId, pos } };
}

export function setExitHand(tableAddr, handId, pos, exitHand) {
  return { type: EXIT_HAND_SET, tableAddr, handId, pos, exitHand };
}

export function updateReceived(tableAddr, hand) {
  return { type: UPDATE_RECEIVED, tableAddr, hand };
}

export function lineupReceived(tableAddr, lineup, smallBlind, handId) {
  return { type: LINEUP_RECEIVED, tableAddr, lineup, smallBlind, handId };
}

export function nextHand(tableAddr, handId) {
  return { type: NEXT_HAND, tableAddr, handId };
}

export function leaveRequest(tableAddr, handId, amount, privKey) {
  return { type: LEAVE_REQUEST, tableAddr, handId, amount, privKey };
}

export function receiptSet(tableAddr, handId, pos, receipt) {
  return { type: RECEIPT_SET, tableAddr, handId, pos, receipt };
}

export function addMessage(message, tableAddr, privKey, created) {
  return { type: ADD_MESSAGE, message, tableAddr, privKey, created };
}

export function sendMessage(message, tableAddr, privKey) {
  return { type: SEND_MESSAGE, message, tableAddr, privKey };
}
