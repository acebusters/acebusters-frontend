import { createSelector } from 'reselect';

const selectTables = (state) => state.get('table');

const makeSelectLobby = () => createSelector(
  selectTables,
  (tableState) => {
    const tableAddresses = [];
    tableState.keySeq().forEach((key) => {
      if (key.length > 20) {
        tableAddresses.push(key);
      }
    });
    return tableAddresses;
  }
);

export {
  makeSelectLobby,
};
