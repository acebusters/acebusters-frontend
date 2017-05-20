/**
* Created by jzobro 20170517
*/
import React from 'react';

import Seat from './Seat';
import ButtonJoinSeat from './ButtonJoinSeat';

import { SeatWrapper } from './styles';

// temp global variables
const coords = [0, 0];

const SeatComponent = (props) => {
  const { myPos, open, pending, pos, sitout, state, whosTurn } = props;
  let seatStatus = '';
  let seat = null;

  if (pending) {
    seatStatus = 'Pending';
  } else if (myPos === undefined) {
    seatStatus = 'Sitting-in';
    // TODO add 'Standing-up' logic
  } else if (typeof sitout === 'number') {
    seatStatus = 'Sit-out';
  } else {
    seatStatus = 'EMPTY';
  }

  if (open) {
    seat = (
      <SeatWrapper coords={coords}>
        <ButtonJoinSeat />
      </SeatWrapper>
    );
  } else {
    let color;
    if (['showdown', 'waiting', 'dealing'].indexOf(state) === -1
          && pos === whosTurn) {
      color = 'green';
    } else {
      color = 'blue';
    }
    seat = (
      <SeatWrapper coords={coords}>
        <Seat
          seatStatus={seatStatus}
          strokeColor={color}
          {...props}
        />
      </SeatWrapper>
    );
  }
  return seat;
};
SeatComponent.propTypes = {
  cards: React.PropTypes.array,
  // coords: React.PropTypes.array,
  folded: React.PropTypes.bool,
  lastAction: React.PropTypes.string,
  lastAmount: React.PropTypes.number,
  myPos: React.PropTypes.number, // seat component position?
  pending: React.PropTypes.bool,
  pos: React.PropTypes.number, // dealer button position?
  sitout: React.PropTypes.number, // amount of time left in sitou
};


export default SeatComponent;
