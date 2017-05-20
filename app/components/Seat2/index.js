/**
* Created by jzobro 20170517
*/
import React from 'react';

import Seat from './Seat';
import ButtonJoinSeat from './ButtonJoinSeat';
/* TODO Remove radial component?
imoprt Radial from '../RadialProgress'
*/

import { SeatWrapper } from './styles';

// temp global variables
const coords = [0, 0];

const SeatComponent = (props) => {
  const {
    folded,
    myPos,
    open,
    pending,
    sitout,
    // whosTurn, state, pos
  } = props;
  let seatStatus = '';
  let seat = null;

  if (pending) {
    seatStatus = 'pending';
  } else if (myPos === undefined) {
    seatStatus = 'sitting-in';
    // TODO add 'Standing-up' logic
  } else if (typeof sitout === 'number') {
    seatStatus = 'sit-out';
  } else if (folded) {
    seatStatus = 'folded';
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
    /* TODO: remove because action is tracked by timeLeft and activePlayer?
    let color;
    if (['showdown', 'waiting', 'dealing'].indexOf(state) === -1
          && pos === whosTurn) {
      color = 'green';
    } else {
      color = 'blue';
    }
    */
    seat = (
      <SeatWrapper coords={coords}>
        <Seat
          seatStatus={seatStatus}
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
  myPos: React.PropTypes.number, // action bar position
  pending: React.PropTypes.bool,
  // pos: React.PropTypes.number, // player position
  sitout: React.PropTypes.number, // amount of time left in sitou
};


export default SeatComponent;
