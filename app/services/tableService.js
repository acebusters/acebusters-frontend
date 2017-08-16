import { Receipt } from 'poker-helper';

import { getWeb3 } from '../containers/AccountProvider/sagas';
import { bn } from '../utils/amountFormatter';
import { promisifyContractCall } from '../utils/promisifyContractCall';
import { conf, ABI_TABLE_FACTORY } from '../app.config';

import { requestApi } from './api';

const request = requestApi(conf().oracleUrl);

class TableService {
  constructor(tableAddr, privKey) {
    this.tableAddr = tableAddr;
    this.privKey = privKey;
  }

  sendMessageReceipt(text) {
    return new Receipt(this.tableAddr).message(text).sign(this.privKey);
  }

  sendMessage(text) {
    const receipt = this.sendMessageReceipt(text);
    return this.message(receipt);
  }

  betReceipt(handId, amount) {
    return new Receipt(this.tableAddr).bet(handId, bn(amount)).sign(this.privKey);
  }

  bet(handId, amount) {
    const receipt = this.betReceipt(handId, amount);
    return this.pay(receipt);
  }

  foldReceipt(handId, amount) {
    return new Receipt(this.tableAddr).fold(handId, bn(amount)).sign(this.privKey);
  }

  fold(handId, amount) {
    const receipt = this.foldReceipt(handId, amount);
    return this.pay(receipt);
  }

  checkPreflopReceipt(handId, amount) {
    return new Receipt(this.tableAddr).checkPre(handId, bn(amount)).sign(this.privKey);
  }

  checkPreflop(handId, amount) {
    const receipt = this.checkPreflopReceipt(handId, amount);
    return this.pay(receipt);
  }

  checkFlopReceipt(handId, amount) {
    return new Receipt(this.tableAddr).checkFlop(handId, bn(amount)).sign(this.privKey);
  }

  checkFlop(handId, amount) {
    const receipt = this.checkFlopReceipt(handId, amount);
    return this.pay(receipt);
  }

  checkTurnReceipt(handId, amount) {
    return new Receipt(this.tableAddr).checkTurn(handId, bn(amount)).sign(this.privKey);
  }

  checkTurn(handId, amount) {
    const receipt = this.checkTurnReceipt(handId, amount);
    return this.pay(receipt);
  }

  checkRiverReceipt(handId, amount) {
    return new Receipt(this.tableAddr).checkRiver(handId, bn(amount)).sign(this.privKey);
  }

  checkRiver(handId, amount) {
    const receipt = this.checkRiverReceipt(handId, amount);
    return this.pay(receipt);
  }

  message(receipt) {
    return request('post', `table/${this.tableAddr}/message`, { msgReceipt: receipt });
  }

  debug() {
    return request('get', `table/${this.tableAddr}/debug`);
  }

  pay(receipt) {
    return request('post', `table/${this.tableAddr}/pay`, undefined, {
      Authorization: receipt,
    });
  }

  leave(handId, leaverAddr) {
    const receipt = new Receipt(this.tableAddr).leave(handId, leaverAddr).sign(this.privKey);
    return request('post', `table/${this.tableAddr}/leave`, undefined, {
      Authorization: receipt,
    });
  }

  show(handId, amount, holeCards) {
    const receipt = new Receipt(this.tableAddr).show(handId, bn(amount)).sign(this.privKey);
    return request('post', `table/${this.tableAddr}/show`, {
      cards: holeCards,
    }, {
      Authorization: receipt,
    });
  }

  sitOut(handId, amount) {
    const receipt = new Receipt(this.tableAddr).sitOut(handId, bn(amount)).sign(this.privKey);
    return this.pay(receipt);
  }

  timeOut() {
    return request('post', `table/${this.tableAddr}/timeout`);
  }

  lineup() {
    return request('post', `table/${this.tableAddr}/lineup`);
  }


  net(handId, payload) {
    return request('post', `table/${this.tableAddr}/hand/${handId}/netting`, {
      nettingSig: payload,
    });
  }
}

export function fetchTableState(tableAddr) {
  return request('get', `table/${tableAddr}/info`);
}

export function getHand(tableAddr, handId) {
  return request('get', `table/${tableAddr}/hand/${handId}`);
}

export function fetchTables() {
  const tableFactoryContract = getWeb3().eth.contract(ABI_TABLE_FACTORY).at(conf().tableFactory);
  return promisifyContractCall(tableFactoryContract.getTables.call)();
}

export default TableService;
