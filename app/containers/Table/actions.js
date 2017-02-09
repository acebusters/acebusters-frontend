/**
 * Created by helge on 20.09.16.
 */

import EWT from 'ethereum-web-token';
import Provider from '../../provider';
import * as Config from '../../app.config';

export const UPDATE_RECEIVED = 'UPDATE_RECEIVED';
export const SEATED = 'SEATED';
export const GET_LINEUP = 'GET_LINEUP';
export const COMPLETE_BET = 'COMPLETE_BET';
export const COMPLETE_FOLD = 'COMPLETE_FOLD';
export const COMPLETE_SHOW = 'COMPLETE_SHOW';
export const COMPLETE_HAND_QUERY = 'COMPLETE_HAND_QUERY';
export const NEXT_HAND = 'NEXT_HAND';
export const SET_CARDS = 'SET_CARDS';
export const GET_HAND = 'GET_HAND';
export const FAILED_REQUEST = 'FAILED_REQUEST';
export const STARTED_REQUEST = 'STARTED_REQUEST';
export const PERFORM_DEALING_ACTION = 'PERFORM_DEALING_ACTION';


const ABI_BET = [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];
const ABI_FOLD = [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];

const checkABIs = {
  flop: [{ name: 'checkFlop', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  turn: [{ name: 'checkTurn', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  river: [{ name: 'checkRiver', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
};

const ABI_SHOW = [{ name: 'show', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }];


export function submitBet(handId, amount, privKey, tableAddr) {
  return (dispatch) => {
    dispatch(startedRequest());
    pay(handId, amount, privKey, tableAddr, ABI_BET, 'bet').then((res) => res.json()).then((holeCards) => {
      dispatch(completeBet(handId, amount, holeCards, privKey));
    }, (error) => {
      dispatch(failedRequest(error));
    });
  };
}

export function submitCheck(handId, amount, privKey, tableAddr, handState) {
  const abi = checkABIs[handState];
  return (dispatch) => {
    dispatch(startedRequest());
    pay(handId, amount, privKey, tableAddr, abi, abi[0].name).then((res) => res.json()).then((holeCards) => {
      dispatch(completeBet(handId, amount, holeCards, privKey));
    }, (error) => {
      dispatch(failedRequest(error));
    });
  };
}

export function submitFold(handId, amount, priv, tableAddr) {
  return (dispatch) => {
    dispatch(startedRequest());
    pay(handId, amount, priv, tableAddr, ABI_FOLD, 'fold').then((res) => res.json()).then(() => {
      dispatch(completeFold(handId));
    }, (error) => {
      dispatch(failedRequest(error));
    });
  };
}

export function submitShow(handId, amount, holeCards, priv, tableAddr) {
  return (dispatch) => {
    dispatch(startedRequest());
    show(handId, amount, holeCards, priv, tableAddr).then((res) => res.json()).then((distribution) => {
      dispatch(completeShow(distribution));
    }, (error) => {
      dispatch(failedRequest(error));
    });
  };
}

export function getLineupSuccess(payload) {
  return { type: GET_LINEUP, payload };
}

export function setCards(cards, pos) {
  return { type: SET_CARDS, cards, pos };
}

export function completeShow(distribution) {
  return { type: COMPLETE_SHOW, distribution };
}

export function completeBet(handId, amount, holeCards, privKey) {
  return { type: COMPLETE_BET, handId, amount, holeCards, privKey };
}

export function completeFold(handId) {
  return { type: COMPLETE_FOLD, handId };
}

export function startedRequest() {
  return { type: STARTED_REQUEST };
}

export function failedRequest(error) {
  return { type: FAILED_REQUEST, error };
}

export function updateReceived(tableState) {
  return { type: UPDATE_RECEIVED, tableState };
}


export function startPolling(tableAddr) {
  return (dispatch) => setInterval(() => {
    fetchCurrentHand(tableAddr).then((res) => res.json()).then((tableState) => {
      dispatch(updateReceived(tableState));
    });
  }, 3000);
}

export function stopPolling(tableAddr) {
  clearInterval(startPolling(tableAddr));
}

function fetchCurrentHand(tableAddr) {
  const promise = new Promise((resolve, reject) => {
    const request = new Request(`${Config.apiBasePath}/table/${tableAddr}/info`);
    fetch(request).then((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });
  return promise;
}

export function pay(handId, amount, priv, tableAddr, abi, action) {
  const promise = new Promise((resolve, reject) => {
    const receipt = new EWT(abi)[action](handId, amount).sign(priv);
    const header = new Headers({ Authorization: receipt });
    const myInit = { headers: header, method: 'POST' };
    const request = new Request(`${Config.apiBasePath}/table/${tableAddr}/pay`, myInit);
    fetch(request).then((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });
  return promise;
}

function show(handId, amount, holeCards, priv, tableAddr) {
  const promise = new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_SHOW).show(handId, amount).sign(priv);
    const header = new Headers({ Authorization: receipt, 'Content-Type': 'application/json' });
    const data = JSON.stringify({ cards: holeCards });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${Config.apiBasePath}/table/${tableAddr}/show`, myInit);
    fetch(request).then((res) => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
  });
  return promise;
}

export function getLineup(tableAddr, privKey) {
  const provider = new Provider(Config.ethNode, privKey);

  const table = provider.getTable(tableAddr);


  const promise = new Promise((resolve, reject) => {
    table.getLineup((error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  }).then((res) => res.json(), (error) => error);

  return promise;
}

