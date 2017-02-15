/**
 * Created by helge on 09.02.17.
 */

import EWT from 'ethereum-web-token';
import { ethNode, ABI_SHOW, apiBasePath } from '../app.config';
import Provider from '../provider';


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

export function pay(handId, amount, priv, tableAddr, abi, action) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(abi)[action](handId, amount).sign(priv);
    const header = new Headers({ Authorization: receipt });
    const myInit = { headers: header, method: 'POST' };
    const request = new Request(`${apiBasePath}/table/${tableAddr}/pay`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((cards) => {
      resolve(cards);
    }, (err) => {
      reject(err);
    });
  });
}

export function show(handId, amount, holeCards, priv, tableAddr) {
  return new Promise((resolve, reject) => {
    const receipt = new EWT(ABI_SHOW).show(handId, amount).sign(priv);
    const header = new Headers({ Authorization: receipt, 'Content-Type': 'application/json' });
    const data = JSON.stringify({ cards: holeCards });
    const myInit = { headers: header, body: data, method: 'POST' };
    const request = new Request(`${apiBasePath}/table/${tableAddr}/show`, myInit);
    fetch(request).then((res) => res.json(), (err) => {
      reject(err);
    }).then((distribution) => {
      resolve(distribution);
    }, (err) => {
      reject(err);
    });
  });
}

export function fetchLineup(tableAddr, privKey) {
  const provider = new Provider(ethNode, privKey);
  const table = provider.getTable(tableAddr);

  return new Promise((resolve, reject) => {
    table.getLineup((error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
}
