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
    isTaken,
    myPos,
    open,
    pos,
    pending,
    sitout,
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
    seatStatus = 'EMPTY'; // successfully resolves to EMPTY
  }

  if (open) {
    seat = (
      <SeatWrapper coords={coords}>
        <ButtonJoinSeat
          onClickHandler={() => isTaken(open, myPos, pending, pos)}
        />
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
  folded: React.PropTypes.bool,
  isTaken: React.PropTypes.func,
  myPos: React.PropTypes.number, // action bar position
  open: React.PropTypes.bool,
  pos: React.PropTypes.number,
  pending: React.PropTypes.bool,
  sitout: React.PropTypes.number, // amount of time left in sitou
};


export default SeatComponent;
