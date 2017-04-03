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
  makeWhosTurnSelector,
  makeOpenSelector,
  makeSitoutSelector,
  makePendingSelector,
  makeAmountCoordsSelector,
  makeCoordsSelector,
  makeDealerSelector,
  makeBlockySelector,
} from './selectors';

import {
  makeMyPosSelector,
  makeStackSelector,
  makeHandStateSelector,
} from '../Table/selectors';

import SeatComponent from '../../components/Seat';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    // Show Action;
    this.opacity = (nextProps.lastAmount !== this.props.lastAmount) ? '1' : 0;

    // manage timer
    if (nextProps.whosTurn === nextProps.pos) {
      if (!this.interval) {
        this.interval = setInterval(() => {
          let timeLeft;
          if (nextProps.hand && nextProps.hand.get('changed')) {
            const deadline = nextProps.hand.get('changed') + 60;
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
  }

  componentWillUnmount() {
    // manage timer
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const timeLeft = (this.state) ? this.state.timeLeft : 0;

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
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
