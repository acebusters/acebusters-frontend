/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { modalAdd, modalDismiss } from '../App/actions';

import {
  pendingToggle,
} from '../Table/actions';

import {
  makeCardsSelector,
  makeLastAmountSelector,
  makeFoldedSelector,
  makeOpenSelector,
  makeSitoutSelector,
  makePendingSelector,
  makeAmountCoordsSelector,
  makeCoordsSelector,
  makeDealerSelector,
  makeBlockySelector,
  makeStackSelector,
} from './selectors';

import {
  makeMyPosSelector,
  makeHandStateSelector,
  makeWhosTurnSelector,
} from '../Table/selectors';

import {
  timeoutSeconds,
} from '../../app.config';

import SeatComponent from '../../components/Seat';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    // Show Action;
    this.opacity = (nextProps.lastAmount !== this.props.lastAmount) ? '1' : 0;
    let timeLeft = timeoutSeconds;
    // manage timer
    if (nextProps.whosTurn === nextProps.pos) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          if (this.props.changed) {
            const deadline = this.props.changed + timeoutSeconds;
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
    const timeLeft = (this.state && this.props.whosTurn === this.props.pos) ? ((this.state.timeLeft * 100) / timeoutSeconds) : timeoutSeconds;
    return (
      <SeatComponent
        {...this.props}
        timeLeft={timeLeft}
      >
      </SeatComponent>
    );
  }
}

export function mapDispatchToProps() {
  return {
    modalAdd: (node) => (modalAdd(node)),
    modalDismiss: () => (modalDismiss()),
    pendingToggle: (tableAddr, handId, pos) => (pendingToggle(tableAddr, handId, pos)),
  };
}


const mapStateToProps = createStructuredSelector({
  state: makeHandStateSelector(),
  dealer: makeDealerSelector(),
  open: makeOpenSelector(),
  pending: makePendingSelector(),
  sitout: makeSitoutSelector(),
  coords: makeCoordsSelector(),
  amountCoords: makeAmountCoordsSelector(),
  myPos: makeMyPosSelector(),
  blocky: makeBlockySelector(),
  whosTurn: makeWhosTurnSelector(),
  lastAmount: makeLastAmountSelector(),
  holeCards: makeCardsSelector(),
  folded: makeFoldedSelector(),
  stackSize: makeStackSelector(),
});

Seat.propTypes = {
  lastAmount: React.PropTypes.number,
  changed: React.PropTypes.number,
  whosTurn: React.PropTypes.number,
  pos: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
