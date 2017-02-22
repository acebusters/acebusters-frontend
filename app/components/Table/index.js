/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import sizeMe from 'react-sizeme';
import { GamePlay, TableInfo, TableArea, TableContainer, PokerTable, TableAndChairs } from './TableWrapper';
import { Board } from './Board';
import { TableHeader } from './TableHeader';
import { computedStyles } from '../../app.config';

function TableComponent(props) {
  return (
    <GamePlay id="game-play" {...props} computedStyles={computedStyles}>
      <TableInfo id="table-info">
        <TableHeader> { props.myAddress } , { props.hand.state }, { props.potSize }, { props.amountToCall } </TableHeader>
      </TableInfo>
      <TableArea id="table-area" computedStyles={computedStyles}>
        <TableContainer id="table-container">
          <TableAndChairs id="table-and-chairs" computedStyles={computedStyles}>
            <PokerTable id="poker-table">
              { props.seats }
              <Board id="board" board={props.board}>
                { props.board }
              </Board>
            </PokerTable>
          </TableAndChairs>

        </TableContainer>
      </TableArea>
    </GamePlay>
  );
}

TableComponent.propTypes = {
  hand: React.PropTypes.object,
  myAddress: React.PropTypes.string,
  board: React.PropTypes.array,
  seats: React.PropTypes.array,
  potSize: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
};

export default sizeMe()(TableComponent);
