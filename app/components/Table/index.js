/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import styled from 'styled-components';
import Grid from 'grid-styled';
import {
  baseColor,
} from 'variables';
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

const TableContainer = styled.div`
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 70em) {
    width: 68em;
    height: 40em;
  }
`;

const Wrapper = styled.div`
  padding: 1em;
`;

const TableAndChairs = styled.div`
  position: relative;
  width: 100%
  padding-bottom: 55%;
  margin-left: 10em;
  @media (min-width: 70em) {
    margin-left: 0;
  }
`;

const PokerTable = styled.div`
  position: absolute;
  border: 2px solid ${baseColor};
  border-radius: 50%;
  top: 20%;  bottom: 20%;  left: 10%;  right: 10%;
`;

function TableComponent(props) {
  return (

    <div>
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
      <TableContainer>
        <TableAndChairs id="table-and-chairs" >
          <PokerTable id="poker-table">
            <Pot>Pot: { props.potSize }</Pot>
            { props.seats }
            <Board id="board" board={props.board}>
              { props.board }
            </Board>
          </PokerTable>
        </TableAndChairs>
        <ActionBar {...props} me={props.lineup[props.myPos]} sb={props.sb}></ActionBar>
      </TableContainer>
    </div>
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
  sb: React.PropTypes.number,
};

export default TableComponent;
