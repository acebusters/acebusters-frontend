import EWT from 'ethereum-web-token';
import fetch from 'isomorphic-fetch';

import { ABI_BET, ABI_SHOW, ABI_FOLD, ABI_LEAVE, checkABIs, apiBasePath } from '../app.config';


function TableService(tableAddr, privKey) {
  this.apiBasePath = apiBasePath;
  this.tableAddr = tableAddr;
  this.privKey = privKey;
}

TableService.prototype.bet = function (handId, amount) {
  console.log(amount);
  const receipt = new EWT(ABI_BET).bet(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.fold = function (handId, amount) {
  const receipt = new EWT(ABI_FOLD).fold(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.checkFlop = function (handId, amount) {
  const receipt = new EWT(checkABIs.flop).checkFlop(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.checkTurn = function (handId, amount) {
  const receipt = new EWT(checkABIs.turn).checkTurn(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.checkRiver = function (handId, amount) {
  const receipt = new EWT(checkABIs.river).checkRiver(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.pay = function (receipt) {
  return new Promise((resolve, reject) => {
    fetch(`${this.apiBasePath}/table/${this.tableAddr}/pay`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: receipt,
      } }).then((rsp) => {
        if (rsp.status >= 200 && rsp.status < 300) {
          rsp.json().then((response) => {
            resolve(response);
          });
          return;
        }
        if (rsp.status < 500) {
          rsp.json().then((response) => {
            reject(response.errorMessage);
          });
          return;
        }
        reject('server error.');
      }).catch((error) => {
        reject(error);
      });
  });
};

TableService.prototype.leave = function (handId) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_LEAVE).leave(handId, 0).sign(this.privKey);
    const header = new Headers({ Authorization: receipt });
    const myInit = { headers: header, method: 'POST' };
    const request = new Request(`${this.apiBasePath}/table/${this.tableAddr}/leave`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((cards) => {
      resolve(cards);
    }, (err) => {
      reject(err);
    });
  });
};

TableService.prototype.show = function (handId, amount, holeCards) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_SHOW).show(handId, amount).sign(this.privKey);
    const header = new Headers({ Authorization: receipt, 'Content-Type': 'application/json' });
    const data = JSON.stringify({ cards: holeCards });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${this.apiBasePath}/table/${this.tableAddr}/show`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((distribution) => {
      resolve(distribution);
    }, (err) => {
      reject(err);
    });
  });
};


TableService.prototype.net = function (handId, payload) {
  return new Promise((resolve, reject) => {
    const header = new Headers({ 'Content-Type': 'application/json' });
    const data = JSON.stringify({ nettingSig: payload });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${this.apiBasePath}/table/${this.tableAddr}/hand/${handId}/netting`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((distribution) => {
      resolve(distribution);
    }, (err) => {
      reject(err);
    });
  });
};

export function fetchTableState(tableAddr) {
  return new Promise((resolve, reject) => {
    const request = new Request(`${apiBasePath}/table/${tableAddr}/info`);
    fetch(request).then(
      (res) => res.json(),
      (error) => reject(error)
    ).then(
      (tableState) => resolve(tableState),
      (err) => reject(err)
    );
  });
}

export function getHand(tableAddr, handId) {
  return new Promise((resolve, reject) => {
    fetch(`${apiBasePath}/table/${tableAddr}/hand/${handId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      } }).then((rsp) => {
        if (rsp.status >= 200 && rsp.status < 300) {
          rsp.json().then((response) => {
            resolve(response);
          });
          return;
        }
        if (rsp.status < 500) {
          rsp.json().then((response) => {
            reject(response.errorMessage);
          });
          return;
        }
        reject('server error.');
      }).catch((error) => {
        reject(error);
      });
  });
}

export function fetchTables() {
  return new Promise((resolve, reject) => {
    fetch(`${apiBasePath}/config`).then(
      (res) => res.json(),
      (error) => reject(error)
    ).then(
      (tables) => resolve(tables.tableContracts),
      (err) => reject(err)
    );
  });
}

export default TableService;
