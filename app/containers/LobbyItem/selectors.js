import { createSelector } from 'reselect';

const tableDataSelector = (state, props) => (state && props) ? state.getIn(['table', props.tableAddr, 'data']) : null;

const makeSelectTableData = () => createSelector(
  tableDataSelector,
  (tableData) => {
    if (!tableData) {
      return null;
    }
    return tableData.toJS();
  }
);

export {
  makeSelectTableData,
};
