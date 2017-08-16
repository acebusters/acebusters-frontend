/**
* Created by jzobro 20170517
*/
import React from 'react';
import PropTypes from 'prop-types';

import Seat from './Seat';
import ButtonJoinSeat from './ButtonJoinSeat';
import ButtonOpenSeat from './ButtonOpenSeat';
import { STATUS_MSG } from '../../app.config';

const SeatComponent = (props) => {
  const {
    isTaken,
    myPos,
    open,
    pos,
    pending,
    myPending,
    reserved,
  } = props;
  if (open) {
    if ((myPos === undefined && !myPending) || pending || reserved) {
      if (pending) {
        return (
          <Seat {...props} {...pending} />
        );
      }

      if (reserved) {
        return (
          <Seat
            {...props}
            seatStatus={STATUS_MSG.sittingIn}
            signerAddr={reserved.signerAddr}
            blocky={reserved.blocky}
            stackSize={Number(reserved.amount)}
          />
        );
      }

      return (
        <ButtonJoinSeat
          onClickHandler={() => isTaken(open, myPos, pending, pos)}
          {...props}
        />
      );
    }
    if (typeof myPos === 'number' || myPending) {
      return <ButtonOpenSeat {...props} />;
    }
  }
  return <Seat {...props} />;
};
SeatComponent.propTypes = {
  isTaken: PropTypes.func,
  myPos: PropTypes.number,
  open: PropTypes.bool,
  pos: PropTypes.number,
  pending: PropTypes.any,
  myPending: PropTypes.any,
  reserved: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default SeatComponent;
