/**
* Created by jzobro 20170520
*/
import React from 'react';

import CardsComponent from './CardsComponent';
import SeatInfo from './SeatInfo';
import StatusAction from './StatusAction';

import {
  SeatContainer,
  SeatWrapper,
  StatusSeat,
  StatusSeatWrapper,
} from './styles';

const Seat = (props) => {
  const {
    activePlayer,
    coords,
    seatStatus,
  } = props;
  return (
    <SeatWrapper coords={coords}>
      <SeatContainer activePlayer={activePlayer}>
        {seatStatus !== 'EMPTY' ?
          <StatusSeatWrapper>
            <StatusSeat>{seatStatus}</StatusSeat>
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
  activePlayer: React.PropTypes.bool,
  coords: React.PropTypes.array,
  seatStatus: React.PropTypes.string,
};

export default Seat;
