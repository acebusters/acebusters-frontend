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
  let status = '';
  let seat = null;
  if (pending) {
    status = 'PENDING';
  } else if (myPos === undefined) {
    status = 'JOINING';
  } else {
    status = 'EMPTY';
  }
  if (open) {
    seat = (
      <SeatWrapper coords={coords}>
        <ButtonJoinSeat label={status} />
      </SeatWrapper>
    );
  } else if (pending) {
    seat = (
      <SeatWrapper coords={coords}>
        <Seat label={status} {...props} />
      </SeatWrapper>
    );
  } else {
    let color;
    if (['showdown', 'waiting', 'dealing'].indexOf(state) === -1
          && pos === whosTurn) {
      color = 'green';
    } else if (typeof sitout === 'number') {
      color = 'gray';
    } else {
      color = 'blue';
    }
    seat = (
      <SeatWrapper coords={coords}>
        <Seat strokeColor={color} {...props} />
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
  myPos: React.PropTypes.array, // seat component position?
  pending: React.PropTypes.bool,
  pos: React.PropTypes.number, // dealer button position?
  sitout: React.PropTypes.bool, // ?
};


export default SeatComponent;
