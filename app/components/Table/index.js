/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import { TableWrapper, PokerTable, SeatsWrapper } from './TableWrapper';
import { Board } from './Board';
import { TableHeader } from './TableHeader';

function TableComponent(props) {
  return (
    <TableWrapper {...props}>
      <TableHeader {...props}> { props.myAddress } , { props.hand.state }</TableHeader>
      <PokerTable>
        <Board board={props.board}>
          { props.board }
        </Board>
      </PokerTable>
      <SeatsWrapper>
        { props.seats }
      </SeatsWrapper>
    </TableWrapper>
  );
}

TableComponent.propTypes = {
  hand: React.PropTypes.object,
  myAddress: React.PropTypes.string,
  board: React.PropTypes.array,
  seats: React.PropTypes.array,
};

export default TableComponent;
