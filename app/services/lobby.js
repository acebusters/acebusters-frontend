/**
 * Created by helge on 08.02.17.
 */

import web3 from 'web3';
import { apiBasePath, tokenContractAddress, ABI_TOKEN_CONTRACT } from '../app.config';

export function getBalanceRequest(address) {
  const contract = web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
  const baseUnit = contract.baseUnit();
  return new Promise((resolve, reject) => {
    contract.balanceOf(address, (err, amount) => {
      if (err) {
        reject(err);
      }
      const balance = amount.toNumber() / (10 ** baseUnit.toNumber());
      resolve(balance);
    });
  });
}

export function getTablesRequest() {
  return new Promise((resolve, reject) => {
    fetch(`${apiBasePath}/config`).then(
      (res) => res.json(),
      (err) => err
    ).then(
      (tables) => resolve(tables),
      (err) => reject(err)
    );
  });
}
