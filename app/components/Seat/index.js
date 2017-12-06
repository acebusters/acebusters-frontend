import React from 'react';
import PropTypes from 'prop-types';
import Seat from 'components/Seat/Seat';
import { STATUS_MSG } from '../../app.config';
import ButtonJoinSeat from './ButtonJoinSeat';
import ButtonOpenSeat from './ButtonOpenSeat';

// eslint-disable-next-line react/prefer-stateless-function
class SeatComponent extends React.Component {
  static propTypes = {
    isTaken: PropTypes.func,
    myPos: PropTypes.number,
    open: PropTypes.bool,
    pos: PropTypes.number,
    pending: PropTypes.shape({
      blocky: PropTypes.string,
      signerAddr: PropTypes.string,
      stackSize: PropTypes.number,
    }),
    myPending: PropTypes.any,
    reserved: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  };
  render() {
    const {
      isTaken,
      myPos,
      open,
      pos,
      pending,
      myPending,
      reserved,
    } = this.props;
    if (open) {
      if ((myPos === undefined && !myPending) || pending || reserved) {
        if (pending) {
          return <Seat {...this.props} {...pending} />;
        }

        if (reserved) {
          return (
            <Seat
              {...this.props}
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
            {...this.props}
          />
        );
      }
      if (typeof myPos === 'number' || myPending) {
        return <ButtonOpenSeat {...this.props} />;
      }
    }
    return <Seat {...this.props} />;
  }
}

export default SeatComponent;
