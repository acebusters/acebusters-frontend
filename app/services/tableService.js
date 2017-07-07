import EWT from 'ethereum-web-token';
import fetch from 'isomorphic-fetch';
import { Receipt } from 'poker-helper';

import { getWeb3 } from '../containers/AccountProvider/sagas';

import {
  ABI_BET,
  ABI_SHOW,
  ABI_FOLD,
  ABI_LEAVE,
  ABI_SIT_OUT,
  ABI_TABLE_FACTORY,
  checkABIs,
  conf,
} from '../app.config';

const confParams = conf();

function TableService(tableAddr, privKey) {
  this.tableAddr = tableAddr;
  this.privKey = privKey;
}

TableService.prototype.sendMessageReceipt = function sendMessageReceipt(text) {
  return new Receipt(this.tableAddr).message(text).sign(this.privKey);
};

TableService.prototype.sendMessage = function sendMessage(text) {
  const receipt = this.sendMessageReceipt(text);
  return this.message(receipt);
};

TableService.prototype.betReceipt = function betReceipt(handId, amount) {
  return new EWT(ABI_BET).bet(handId, amount).sign(this.privKey);
};

TableService.prototype.bet = function bet(handId, amount) {
  const receipt = this.betReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.foldReceipt = function foldReceipt(handId, amount) {
  return new EWT(ABI_FOLD).fold(handId, amount).sign(this.privKey);
};

TableService.prototype.fold = function fold(handId, amount) {
  const receipt = this.foldReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.checkPreflopReceipt = function checkPreflopReceipt(handId, amount) {
  return new EWT(checkABIs.preflop).checkPre(handId, amount).sign(this.privKey);
};

TableService.prototype.checkPreflop = function checkPreflop(handId, amount) {
  const receipt = this.checkPreflopReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.checkFlopReceipt = function checkFlopReceipt(handId, amount) {
  return new EWT(checkABIs.flop).checkFlop(handId, amount).sign(this.privKey);
};

TableService.prototype.checkFlop = function checkFlop(handId, amount) {
  const receipt = this.checkFlopReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.checkTurnReceipt = function checkTurnReceipt(handId, amount) {
  return new EWT(checkABIs.turn).checkTurn(handId, amount).sign(this.privKey);
};

TableService.prototype.checkTurn = function checkTurn(handId, amount) {
  const receipt = this.checkTurnReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.checkRiverReceipt = function checkRiverReceipt(handId, amount) {
  return new EWT(checkABIs.river).checkRiver(handId, amount).sign(this.privKey);
};

TableService.prototype.checkRiver = function checkRiver(handId, amount) {
  const receipt = this.checkRiverReceipt(handId, amount);
  return this.pay(receipt);
};

TableService.prototype.message = function message(receipt) {
  return new Promise((resolve, reject) => {
    const header = new Headers({ 'Content-Type': 'application/json' });
    const data = JSON.stringify({ msgReceipt: receipt });
    const requestInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${confParams.oracleUrl}/table/${this.tableAddr}/message`, requestInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((response) => {
      resolve(response);
    }, (err) => {
      reject(err);
    });
  });
};

TableService.prototype.debug = function debug() {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.oracleUrl}/table/${this.tableAddr}/debug`, {
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
};

TableService.prototype.pay = function pay(receipt) {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.oracleUrl}/table/${this.tableAddr}/pay`, {
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

TableService.prototype.leave = function leave(handId) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_LEAVE).leave(handId, 0).sign(this.privKey);
    const header = new Headers({ Authorization: receipt });
    const myInit = { headers: header, method: 'POST' };
    const request = new Request(`${confParams.oracleUrl}/table/${this.tableAddr}/leave`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((cards) => {
      resolve(cards);
    }, (err) => {
      reject(err);
    });
  });
};

TableService.prototype.show = function show(handId, amount, holeCards) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_SHOW).show(handId, amount).sign(this.privKey);
    const header = new Headers({ Authorization: receipt, 'Content-Type': 'application/json' });
    const data = JSON.stringify({ cards: holeCards });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${confParams.oracleUrl}/table/${this.tableAddr}/show`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((distribution) => {
      resolve(distribution);
    }, (err) => {
      reject(err);
    });
  });
};

TableService.prototype.sitOut = function sitOut(handId, amount) {
  const receipt = new EWT(ABI_SIT_OUT).sitOut(handId, amount).sign(this.privKey);
  return this.pay(receipt);
};

TableService.prototype.timeOut = function timeOut() {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.oracleUrl}/table/${this.tableAddr}/timeout`, {
      method: 'POST',
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
};

TableService.prototype.lineup = function lineup() {
  return new Promise((resolve, reject) => {
    fetch(`${confParams.oracleUrl}/table/${this.tableAddr}/lineup`, {
      method: 'POST',
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
};


TableService.prototype.net = function net(handId, payload) {
  return new Promise((resolve, reject) => {
    const header = new Headers({ 'Content-Type': 'application/json' });
    const data = JSON.stringify({ nettingSig: payload });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${confParams.oracleUrl}/table/${this.tableAddr}/hand/${handId}/netting`, myInit);
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
    const request = new Request(`${confParams.oracleUrl}/table/${tableAddr}/info`);
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
    fetch(`${confParams.oracleUrl}/table/${tableAddr}/hand/${handId}`, {
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
  const tableFactoryContract = getWeb3()
    .eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);

  return new Promise((resolve, reject) => {
    tableFactoryContract.getTables.call((e, a) => {
      if (e) return reject(e);
      return resolve(a);
    });
  });
}

export default TableService;
