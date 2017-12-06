import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { modalAdd, modalDismiss } from '../App/actions';

import {
  makeCardsSelector,
  makeLastAmountSelector,
  makeFoldedSelector,
  makeOpenSelector,
  makeSitoutSelector,
  makePendingSelector,
  makeMyPendingSelector,
  makeAmountCoordsSelector,
  makeLastActionSelector,
  makeCoordsSelector,
  makeShowStatusSelector,
  makeDealerSelector,
  makeBlockySelector,
  makeStackSelector,
  makeSeatStatusSelector,
  makeReservedSelector,
} from './selectors';

import {
  makeMyPosSelector,
  makeHandStateSelector,
  makeHandSelector,
  makeWhosTurnSelector,
} from '../Table/selectors';

import {
  TIMEOUT_PERIOD,
} from '../../app.config';

import SeatComponent from '../../components/Seat';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { wasMostRecentAction: false };
  }
  componentWillReceiveProps(nextProps) {
    // Show Action if most recent action
    this.setState({
      wasMostRecentAction: nextProps.lastAmount === this.props.lastAmount,
    });

    // manage timer
    const timeoutSeconds = TIMEOUT_PERIOD(this.props.state);
    let timeLeft = timeoutSeconds;
    const changed = this.props.hand ? this.props.hand.get('changed') : null;
    if (nextProps.whosTurn === nextProps.pos) {
      // TODO: Make timeLeft count down from 100 - 0, right now is 360 - 0?
      if (!this.interval) {
        this.interval = setInterval(() => {
          if (changed) {
            const deadline = changed + timeoutSeconds;
            timeLeft = deadline - Math.floor(Date.now() / 1000);
            if (timeLeft <= 0) {
              clearInterval(this.interval);
              this.interval = null;
            } else {
              this.setState({ timeLeft });
            }
          }
        }, 1000);
      }
    } else if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({ timeLeft });
  }

  componentWillUnmount() {
    // manage timer
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { state, pos, whosTurn } = this.props;
    const timeoutSeconds = TIMEOUT_PERIOD(state);
    const timeLeft = (
      whosTurn === pos
      ? ((this.state.timeLeft * 100) / timeoutSeconds)
      : timeoutSeconds
    );

    return (
      <SeatComponent
        {...this.props}
        timeLeft={timeLeft}
        wasMostRecentAction={this.state.wasMostRecentAction}
      />
    );
  }
}

export function mapDispatchToProps() {
  return {
    modalAdd,
    modalDismiss,
  };
}

const mapStateToProps = createStructuredSelector({
  state: makeHandStateSelector(),
  dealer: makeDealerSelector(),
  open: makeOpenSelector(),
  seatStatus: makeSeatStatusSelector(),
  pending: makePendingSelector(),
  reserved: makeReservedSelector(),
  myPending: makeMyPendingSelector(),
  sitout: makeSitoutSelector(),
  showStatus: makeShowStatusSelector(),
  coords: makeCoordsSelector(),
  amountCoords: makeAmountCoordsSelector(),
  myPos: makeMyPosSelector(),
  blocky: makeBlockySelector(),
  whosTurn: makeWhosTurnSelector(),
  lastAmount: makeLastAmountSelector(),
  lastAction: makeLastActionSelector(),
  holeCards: makeCardsSelector(),
  folded: makeFoldedSelector(),
  stackSize: makeStackSelector(),
  hand: makeHandSelector(),
});

Seat.propTypes = {
  lastAmount: PropTypes.number,
  whosTurn: PropTypes.number,
  state: PropTypes.string,
  pos: PropTypes.number,
  hand: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
