/**
 * Created by helge on 07.10.16.
 */

export const GET_BALANCE = 'GET_BALANCE';
export const BALANCE_UPDATED = 'BALANCE_UPDATED';
export const BALANCE_UPDATE_ERROR = 'BALANCE_UPDATE_ERROR';
export const GET_TABLES = 'GET_TABLES';
export const TABLES_UPDATED = 'TABLES_UPDATED';
export const TABLES_UPDATE_ERROR = 'TABLES_UPDATE_ERROR';
export const JOIN_TABLE = 'JOIN_TABLE';


export function joinTable(id) {
  return {
    type: JOIN_TABLE,
    id,
  };
}

export function getBalance(address) {
  return {
    type: GET_BALANCE,
    address,
  };
}

export function balanceUpdated(balance) {
  return {
    type: BALANCE_UPDATED,
    balance,
  };
}

export function balanceUpdateError(error) {
  return {
    type: BALANCE_UPDATE_ERROR,
    error,
  };
}

export function getTables() {
  return {
    type: GET_TABLES,
  };
}

export function tablesUpdated(tables) {
  return {
    type: TABLES_UPDATED,
    tables,
  };
}


export function tablesUpdateError(error) {
  return {
    type: TABLES_UPDATE_ERROR,
    error,
  };
}
