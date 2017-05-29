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
  makeLastActionSelector,
  makeCoordsSelector,
  makeShowStatusSelector,
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
    let timeLeft = timeoutSeconds;
    if (nextProps.whosTurn === nextProps.pos) {
      // TODO: Make timeLeft count down from 100 - 0, right now is 360 - 0?
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
        wasMostRecentAction={this.state.wasMostRecentAction}
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
});

Seat.propTypes = {
  lastAmount: React.PropTypes.number,
  changed: React.PropTypes.number,
  whosTurn: React.PropTypes.number,
  pos: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
