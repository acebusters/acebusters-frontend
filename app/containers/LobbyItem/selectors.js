import { createSelector } from 'reselect';

const tableSelector = (state, props) => (state && props) ? state.getIn(['table', props.tableAddr]) : null;

const makeSelectTableData = () => createSelector(
  tableSelector,
  (table) => {
    if (!table || !table.get('data')) {
      return null;
    }
    return table.get('data').toJS();
  }
);

const makeSelectTableLastHandId = () => createSelector(
  tableSelector,
  (table) => {
    if (!table) {
      return null;
    }
    let max = 0;
    table.keySeq().forEach((k) => {
      if (!isNaN(k)) {
        const handId = parseInt(k, 10);
        if (handId > max) {
          max = handId;
        }
      }
    });
    if (max > 0) {
      return max;
    }
    return table.getIn(['data', 'lastHandNetted']) + 1;
  }
);

export {
  makeSelectTableData,
  makeSelectTableLastHandId,
};
