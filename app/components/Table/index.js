import React from 'react';
import PropTypes from 'prop-types';
import { Board } from './Board';
import TableMenu from '../../containers/TableMenu';
import ActionBar from '../../containers/ActionBar';
import tableImage from './tableBG.svg';
import Pot from '../Pot';
import Curtain from '../../containers/Curtain';
import { tableNameByAddress } from '../../services/tableNames';

import {
  TableName,
  TableContainer,
  TableAndChairs,
  PokerTable,
  HandBox,
  Winner,
} from './styles';

const TableComponent = (props) => (
  <div name="table-component">
    <Curtain {...props} />

    <TableContainer name="table-container">
      <TableName>
        {tableNameByAddress(props.params.tableAddr)}
      </TableName>

      <TableAndChairs id="table-and-chairs" >
        <PokerTable>
          <img src={tableImage} alt="" />
          { props.potSize > 0 &&
            <Pot className="pot" potSize={props.potSize} top="58%" left="50%" />
          }

          { props.seats }

          <Board id="board" board={props.board}>
            { props.board }
          </Board>

          { props.winners.length > 0 &&
            <Winner className="winner">{ props.winners }</Winner>
          }
        </PokerTable>
      </TableAndChairs>

      {props.myHand &&
        <HandBox className="hand-box">{props.myHand.descr}</HandBox>
      }

      <TableMenu {...props} />

      <ActionBar className="action-bar" {...props} sb={props.sb}></ActionBar>

    </TableContainer>

  </div>
);

TableComponent.propTypes = {
  board: PropTypes.array,
  seats: PropTypes.array,
  potSize: PropTypes.number,
  winners: PropTypes.array,
  myHand: PropTypes.object,
  sb: PropTypes.number,
  params: PropTypes.object,
};

export default TableComponent;
