/**
* Created by jzobro 20170520
*/
import React from 'react';

import CardsComponent from './CardsComponent';
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
  } = props;

  return (
    <SeatWrapper coords={coords} pos={pos} myPos={myPos}>
      <SeatContainer
        activePlayer={seatStatus && seatStatus === STATUS_MSG.active}
      >
        {seatStatus && seatStatus !== STATUS_MSG.active ?
          <StatusSeatWrapper>
            <StatusSeat>{seatStatus.msg}</StatusSeat>
          </StatusSeatWrapper>
          :
          <CardsComponent {...props} />
        }

        <SeatInfo {...props} />

        <StatusAction {...props} />

      </SeatContainer>
    </SeatWrapper>
  );
};
Seat.propTypes = {
  myPos: React.PropTypes.number,
  pos: React.PropTypes.number,
  coords: React.PropTypes.array,
  seatStatus: React.PropTypes.object,
};

export default Seat;
