import React from 'react';
import PropTypes from 'prop-types';

import HoleCards from 'components/Card/HoleCards';
import SeatInfo from './SeatInfo';
import StatusAction from './StatusAction';
import { STATUS_MSG } from '../../app.config';

import {
  SeatContainer,
  SeatWrapper,
  StatusSeat,
  StatusSeatWrapper,
} from './styles';

const Seat = (props) => {
  const {
    coords,
    pos,
    myPos,
    seatStatus,
    holeCards,
    folded,
  } = props;

  return (
    <SeatWrapper coords={coords} pos={pos} myPos={myPos}>
      <SeatContainer activePlayer={seatStatus && seatStatus === STATUS_MSG.active}>
        {seatStatus && seatStatus !== STATUS_MSG.active &&
          <StatusSeatWrapper>
            <StatusSeat>{seatStatus.msg}</StatusSeat>
          </StatusSeatWrapper>
        }
        {(!seatStatus || seatStatus === STATUS_MSG.active) &&
          <HoleCards {...{ holeCards, folded }} />
        }
        <SeatInfo {...props} />
        <StatusAction {...props} />
      </SeatContainer>
    </SeatWrapper>
  );
};
Seat.propTypes = {
  myPos: PropTypes.number,
  pos: PropTypes.number,
  coords: PropTypes.array,
  seatStatus: PropTypes.object,
  holeCards: PropTypes.array,
  folded: PropTypes.bool,
};

export default Seat;
