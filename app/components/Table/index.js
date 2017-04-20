/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import styled from 'styled-components';
import {
  black,
  white,
} from 'variables';
import { Board } from './Board';
import { ActionButton } from '../ActionBar';
import ActionBar from '../../containers/ActionBar';
import tableImage from './tableBG.svg';

export const Pot = styled.div`
  position: absolute;
  color: ${white};
  left: 50%;
  top: 10%
  transform: translateX(-50%);
`;

export const TableContainer = styled.div`
  margin-right: auto;
  margin-left: auto;
`;

export const TableHeader = styled.div`
   position: relative;
   text-align: left;
   color: ${white};
   padding-left: 10em;
`;

export const Wrapper = styled.div`
  position: absolute;
  left: 2em;
  z-index: 10;
  height: 10%
  width: 20%;
  bottom: 2em;
`;

export const Winner = styled.div`
  left: 50%;
  top: 100%;
  position: absolute;
  padding: 0.5em;
  background-color: ${black};
  border-radius: 0.5em;
  color: ${white};
  transform: translate(-50%,-20%);
`;

export const TableAndChairs = styled.div`
  position: relative;
  width: 100%
  padding-bottom: 50%;
`;

export const HandBox = styled.div`
  left: 80%;
  top: 80%;
  position: absolute;
  padding: 0.5em;
  background-color: ${black};
  border-radius: 0.5em;
  color: ${white};
  transform: translate(-50%,-20%);
`;

export const PokerTable = styled.div`
  position: absolute;
  margin-top: 10%;
  border-radius: 50%;
  transform: translateX(-50%);
  left: 50%;
  width: 50%;
  height: 40%;
`;

function TableComponent(props) {
  const icon = (props.sitout) ? 'fa fa-play' : 'fa fa-pause';
  return (
    <div>
      { (props.myPos > -1) &&
        <Wrapper>
          <ActionButton size="small" onClick={props.onLeave} icon="fa fa-sign-out" />
            { !props.pending &&
              <ActionButton size="small" onClick={props.onSitout} icon={icon} />
            }
        </Wrapper>
      }
      <TableHeader>
        { `state: ${props.state}` } <br />
      </TableHeader>
      <TableContainer>
        <TableAndChairs id="table-and-chairs" >
          <PokerTable id="poker-table">
            <img src={tableImage} alt="" />
            { props.winners.length > 0 &&
              <Winner>{ props.winners }</Winner>
            }
            <Pot>Pot: { props.potSize }</Pot>
            { props.seats }
            <Board id="board" board={props.board}>
              { props.board }
            </Board>
          </PokerTable>
        </TableAndChairs>
        { props.myHand &&
          <HandBox> { props.myHand.descr }</HandBox>
        }
        <ActionBar {...props} sb={props.sb}></ActionBar>
      </TableContainer>
    </div>
  );
}

TableComponent.propTypes = {
  state: React.PropTypes.string,
  onLeave: React.PropTypes.any,
  pending: React.PropTypes.bool,
  onSitout: React.PropTypes.any,
  board: React.PropTypes.array,
  sitout: React.PropTypes.bool,
  seats: React.PropTypes.array,
  potSize: React.PropTypes.number,
  myPos: React.PropTypes.number,
  winners: React.PropTypes.array,
  myHand: React.PropTypes.object,
  sb: React.PropTypes.number,
};

export default TableComponent;
