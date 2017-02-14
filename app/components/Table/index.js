/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import { TableWrapper, PokerTable } from './TableWrapper';

function TableComponent(props) {
  return (
    <TableWrapper {...props}>
      <PokerTable></PokerTable>
    </TableWrapper>
  );
}

TableComponent.propTypes = {

};

export default TableComponent;
