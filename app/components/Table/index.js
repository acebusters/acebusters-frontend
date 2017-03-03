/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import { GamePlay, TableArea, TableContainer, PokerTable, TableAndChairs } from './TableWrapper';
import { Board } from './Board';
import { TableHeader } from './TableHeader';
import { computedStyles } from '../../app.config';
import ActionBar from '../../containers/ActionBar';

function TableComponent(props) {
  return (
    <GamePlay id="game-play" {...props} computedStyles={computedStyles}>
      <TableArea id="table-area" computedStyles={computedStyles}>
        <TableHeader> { props.myAddress }, { props.hand.state }, { props.potSize }, { props.amountToCall }, { props.sb }, { props.sb * 2 } </TableHeader>
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
      <ActionBar {...props} me={props.lineup[props.myPos]}></ActionBar>
    </GamePlay>
  );
}

TableComponent.propTypes = {
  hand: React.PropTypes.object,
  lineup: React.PropTypes.any,
  myAddress: React.PropTypes.string,
  board: React.PropTypes.array,
  seats: React.PropTypes.array,
  potSize: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  myPos: React.PropTypes.number,
  sb: React.PropTypes.number,
};

export default TableComponent;
