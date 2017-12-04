import React from 'react';
import PropTypes from 'prop-types';
import BoardCards from '../Card/BoardCards';
import TableMenu from '../../containers/TableMenu';
import ActionBar from '../../containers/ActionBar';
import tableImage from './tableBG.svg';
import Pot from '../Pot';
import Curtain from '../../containers/Curtain';
import { tableNameByAddress } from '../../services/tableNames';
import { nickNameByAddress } from '../../services/nicknames';
import { formatNtz } from '../../utils/amountFormatter';
import { SEAT_COORDS } from '../../app.config';
import { getPosCoords } from '../../containers/Seat/utils';

import {
  TableName,
  TableContainer,
  TableAndChairs,
  PokerTable,
  HandBox,
  Winner,
} from './styles';

const defaultPotPos = { left: '50%', top: '58%' };

const getPosByAddr = (lineup, addr) => lineup.findIndex((seat) => seat.get('address') === addr);

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      win: false,
      potsPositions: [defaultPotPos],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.winners && !nextProps.winners) {
      this.setState({
        potsPositions: [defaultPotPos],
      });
    }

    if (!this.props.winners && nextProps.winners) {
      this.setState({
        potsPositions: nextProps.winners.map(() => defaultPotPos),
      });

      setTimeout(() => {
        this.setState((state, props) => ({
          potsPositions: props.winners.map((winner) => {
            const pos = getPosByAddr(props.lineup, winner.addr);
            const coords = getPosCoords(SEAT_COORDS, props.lineup.size, pos);
            return {
              left: `calc(${coords[0]}% + 15px)`,
              top: `calc(${coords[1]}% + 75px)`,
            };
          }),
        }));
      }, 0);
    }
  }

  renderWinners() {
    const winners = this.props.winners || [];
    return winners.map((winner, i) => (
      <div key={i}>
        {nickNameByAddress(winner.addr)} won {formatNtz(winner.amount - winner.maxBet)} NTZ {(winner.hand) ? `with ${winner.hand}` : ''}
      </div>
    ));
  }

  render() {
    const { params, potSize, seats, board, winners, myHand, sb } = this.props;
    const { potsPositions } = this.state;

    return (
      <div name="table-component">
        <Curtain {...this.props} />

        <TableContainer name="table-container">
          <TableName>
            {tableNameByAddress(params.tableAddr)}
          </TableName>

          <TableAndChairs id="table-and-chairs" >
            <PokerTable>
              <img src={tableImage} alt="" />

              {potSize > 0 && !winners &&
                <Pot
                  className="pot"
                  potSize={potSize}
                  top={potsPositions[0].top}
                  left={potsPositions[0].left}
                  key={0}
                />
              }

              {winners && winners.map((winner, i) => (
                <Pot
                  className="pot"
                  potSize={winners.length === 1 ? potSize : winner.amount}
                  top={potsPositions[i].top}
                  left={potsPositions[i].left}
                  key={i}
                />
              )).filter((el) => el.props.potSize > 0)}

              {seats}

              <BoardCards board={board} />

              {winners &&
                <Winner className="winner">
                  {this.renderWinners()}
                </Winner>
              }
            </PokerTable>
          </TableAndChairs>

          {myHand &&
            <HandBox className="hand-box">{myHand.descr}</HandBox>
          }

          <TableMenu {...this.props} />
          <ActionBar className="action-bar" {...this.props} sb={sb} />
        </TableContainer>

      </div>
    );
  }
}

TableComponent.propTypes = {
  board: PropTypes.array,
  seats: PropTypes.array,
  potSize: PropTypes.number,
  winners: PropTypes.array,
  myHand: PropTypes.object,
  sb: PropTypes.number,
  params: PropTypes.object,
  lineup: PropTypes.object,
};

export default TableComponent;
