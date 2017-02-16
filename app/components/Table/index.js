/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import { TableWrapper, PokerTable } from './TableWrapper';
import { Board } from './Board';

function TableComponent(props) {
  return (
    <TableWrapper {...props}>
      <PokerTable>
        <Board board={props.board}>
          {props.board}
        </Board>
      </PokerTable>
    </TableWrapper>
  );
}

TableComponent.propTypes = {
  board: React.PropTypes.array,
};

export default TableComponent;
