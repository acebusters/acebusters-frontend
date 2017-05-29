/**
* Created by jzobro 20170517
*/
import React from 'react';

import Seat from './Seat';
import ButtonJoinSeat from './ButtonJoinSeat';
import ButtonInvite from './ButtonInvite';
/* TODO Remove radial component?
imoprt Radial from '../RadialProgress'
*/

const isActivePlayer = (seatStatus) => {
  if (seatStatus === 'sitting-in') return false;
  if (seatStatus === 'standing-up') return false;
  if (seatStatus === 'sit-out') return false;
  return true;
};

const seatStatus = (pending, myPos, sitout) => {
  if (pending) {
    if (myPos === undefined) return 'sitting-in';
    if (myPos !== undefined) return 'standing-up';
  } else if (typeof sitout === 'number') {
    return 'sit-out';
  }
  return 'EMPTY'; // successfully resolves to EMPTY
};

const SeatComponent = (props) => {
  const {
    coords,
    isTaken,
    myPos,
    open,
    pos,
    pending,
    sitout,
  } = props;
  const seatStatusResult = seatStatus(pending, myPos, sitout);
  if (open) {
    if (myPos === undefined) {
      return (
        <ButtonJoinSeat
          coords={coords}
          onClickHandler={() => isTaken(open, myPos, pending, pos)}
        />
      );
    }
    if (typeof myPos === 'number') {
      return (
        <ButtonInvite
          coords={coords}
          onClickHandler={() => isTaken(open, myPos, pending, pos)}
        />
      );
    }
  }
  return (
    <Seat
      activePlayer={isActivePlayer(seatStatusResult)}
      seatStatus={seatStatusResult}
      {...props}
    />
  );
};
SeatComponent.propTypes = {
  coords: React.PropTypes.array,
  isTaken: React.PropTypes.func,
  myPos: React.PropTypes.number, // action bar position
  open: React.PropTypes.bool,
  pos: React.PropTypes.number,
  pending: React.PropTypes.bool,
  sitout: React.PropTypes.number, // amount of time left in sitou
};

export default SeatComponent;
