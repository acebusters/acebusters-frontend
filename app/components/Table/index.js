/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';
import { GamePlay, TableArea, TableContainer, PokerTable, TableAndChairs } from './TableWrapper';
import { Board } from './Board';
import { TableHeader } from './TableHeader';
import ActionBar from '../../containers/ActionBar';
import Button from '../../components/Button';

const Pot = styled.div`
  position: absolute;
  color: white;
  left: 50%;
  top: 10%
  transform: translateX(-50%);
`;

const Wrapper = styled.div`
  padding: 1em;
`;

function TableComponent(props) {
  return (
    <GamePlay id="game-play" {...props} computedStyles={props.computedStyles}>
      <TableArea id="table-area" computedStyles={props.computedStyles}>
        { (props.myPos > -1) &&
          <Wrapper>
            <Grid xs={1 / 2} ><Button size="medium" onClick={props.onLeave} >Leave</Button></Grid>
            <Grid xs={1 / 2} ><Button size="medium" onClick={props.onSitout} >SitOut</Button></Grid>
          </Wrapper>
         }
        <TableHeader>
          { `state: ${props.state}` } <br />
          { `amount to call: ${props.amountToCall}` } <br />
          { `sb: ${props.sb}` }
        </TableHeader>
        <TableContainer id="table-container">
          <TableAndChairs id="table-and-chairs" computedStyles={props.computedStyles}>
            <PokerTable id="poker-table">
              <Pot>Pot: { props.potSize }</Pot>
              { props.seats }
              <Board id="board" board={props.board}>
                { props.board }
              </Board>
            </PokerTable>
          </TableAndChairs>
        </TableContainer>
      </TableArea>
      <ActionBar {...props} me={props.lineup[props.myPos]} sb={props.sb}></ActionBar>
    </GamePlay>
  );
}

TableComponent.propTypes = {
  state: React.PropTypes.string,
  lineup: React.PropTypes.any,
  onLeave: React.PropTypes.any,
  onSitout: React.PropTypes.any,
  board: React.PropTypes.array,
  seats: React.PropTypes.array,
  potSize: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  myPos: React.PropTypes.number,
  computedStyles: React.PropTypes.object,
  sb: React.PropTypes.number,
};

export default TableComponent;
