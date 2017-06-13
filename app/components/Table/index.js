/**
 * Created by helge on 14.02.17.
 */

import React from 'react';
import { Board } from './Board';
import TableMenu from '../../containers/TableMenu';
import ActionBar from '../../containers/ActionBar';
import tableImage from './tableBG.svg';
import Pot from '../Pot';
import Curtain from '../../containers/Curtain';

import {
  TableHeader,
  TableContainer,
  TableAndChairs,
  PokerTable,
  HandBox,
  Winner,
} from './styles';

const TableComponent = (props) => (
  <div name="table-component">
    <Curtain {...props} />

    <TableHeader className="table-header">
      { `state: ${props.state}` } <br />
    </TableHeader>

    <TableContainer name="table-container">

      <TableAndChairs id="table-and-chairs" >

        <PokerTable name="poker-table">

          <img src={tableImage} alt="" />

          <Pot potSize={props.potSize} top="85%" left="45%" />

          { props.seats }

          <Board id="board" board={props.board}>
            { props.board }
          </Board>

          { props.winners.length > 0 &&
            <Winner className="winner">{ props.winners }</Winner>
          }
        </PokerTable>

      </TableAndChairs>

      { props.myHand &&
        <HandBox className="hand-box"> { props.myHand.descr }</HandBox>
      }

      <TableMenu {...props} />

      <ActionBar className="action-bar" {...props} sb={props.sb}></ActionBar>

    </TableContainer>

  </div>
);

TableComponent.propTypes = {
  state: React.PropTypes.string,
  board: React.PropTypes.array,
  seats: React.PropTypes.array,
  potSize: React.PropTypes.number,
  winners: React.PropTypes.array,
  myHand: React.PropTypes.object,
  sb: React.PropTypes.number,
};

export default TableComponent;
