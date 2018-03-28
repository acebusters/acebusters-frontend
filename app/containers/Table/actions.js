import { createFormAction } from '../../services/reduxFormSaga';

export const HAND_REQUEST = 'acebusters/Table/HAND_REQUEST';
export const NEXT_HAND = 'acebusters/Table/NEXT_HAND';
export const SET_CARDS = 'acebusters/Table/SET_CARDS';
export const RESIZE_TABLE = 'acebusters/Table/RESIZE_TABLE';
export const LOAD_TABLE = 'acebusters/Table/LOAD_TABLE';
export const TABLE_LOAD_ERROR = 'acebusters/Table/TABLE_LOAD_ERROR';
export const TABLE_LOAD_SUCCESS = 'acebusters/Table/TABLE_LOAD_SUCCESS';
export const TABLE_RECEIVED = 'acebusters/Table/TABLE_RECEIVED';
export const UPDATE_RECEIVED = 'acebusters/Table/UPDATE_RECEIVED';
export const LINEUP_RECEIVED = 'acebusters/Table/LINEUP_RECEIVED';
export const RESERVATION_RECEIVED = 'acebusters/Table/RESERVATION_RECEIVED';
export const SEAT_RESERVED = 'acebusters/Table/SEAT_RESERVED';
export const SEATS_RELEASED = 'acebusters/Table/SEATS_RELEASED';
export const LEAVE_REQUEST = 'acebusters/Table/LEAVE_REQUEST';
export const JOIN_TABLE = 'acebusters/Table/JOIN_TABLE';
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
export const RESERVE_SEAT = 'acebusters/Chat/RESERVE_SEAT';

export function setCards(tableAddr, handId, cards) {
  return { type: SET_CARDS, tableAddr, handId, cards };
}

export const pay = createFormAction('PAY');

export const sitOutToggle = createFormAction('SITOUT_TOGGLE');

export function bet(tableAddr, handId, amount, privKey, pos, prevReceipt) {
  return { type: BET, tableAddr, handId, amount, privKey, pos, prevReceipt };
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

export function loadTable(tableAddr) {
  return { type: LOAD_TABLE, tableAddr };
}

export function tableLoadError(tableAddr) {
  return { type: TABLE_LOAD_ERROR, tableAddr };
}

export function tableLoadSuccess(tableAddr) {
  return { type: TABLE_LOAD_SUCCESS, tableAddr };
}

export function setPending(tableAddr, handId, pos, data) {
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

export function lineupReceived(tableAddr, lineup, handId, myPendingSeat, smallBlind) {
  return { type: LINEUP_RECEIVED, tableAddr, lineup, handId, myPendingSeat, smallBlind };
}

export function reservationReceived(tableAddr, reservation) {
  return { type: RESERVATION_RECEIVED, payload: reservation, meta: { tableAddr } };
}

export function seatReserved(tableAddr, seatData) {
  return { type: SEAT_RESERVED, payload: seatData, meta: { tableAddr } };
}

export function seatsReleased(tableAddr, seatsData) {
  return { type: SEATS_RELEASED, payload: seatsData, meta: { tableAddr } };
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

export function reserveSeat(tableAddr, pos, signerAddr, txHash, amount) {
  return {
    type: RESERVE_SEAT,
    payload: { tableAddr, pos, signerAddr, txHash, amount },
  };
}
