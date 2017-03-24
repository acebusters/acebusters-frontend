/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeCardsSelector,
  makeLastAmountSelector,
  makeFoldedSelector,
  makeWhosTurnSelector,
  makeLastActionSelector,
  makeMyCardsSelector,
} from './selectors';

import {
  makeMyPosSelector,
  makeHandSelector,
  makeLineupSelector,
  makeStackSelector,
} from '../Table/selectors';

import {
  makeSelectGravatar,
} from '../AccountProvider/selectors';

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
    let cards = (this.props.pos === this.props.myPos) ? this.props.myCards : this.props.cards;
    if (!cards) {
      cards = [-1, -1];
    }
    return (
      <SeatComponent {...this.props} timeLeft={timeLeft} opacity={this.opacity} holeCards={cards}></SeatComponent>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  lineup: makeLineupSelector(),
  myPos: makeMyPosSelector(),
  whosTurn: makeWhosTurnSelector(),
  lastAmount: makeLastAmountSelector(),
  cards: makeCardsSelector(),
  myCards: makeMyCardsSelector(),
  folded: makeFoldedSelector(),
  lastAction: makeLastActionSelector(),
  stackSize: makeStackSelector(),
  gravatarUrl: makeSelectGravatar(),
});


export function mapDispatchToProps(dispatch) {
  return { dispatch };
}

Seat.propTypes = {
  lastAmount: React.PropTypes.number,
  cards: React.PropTypes.array,
  pos: React.PropTypes.number,
  myPos: React.PropTypes.number,
  myCards: React.PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
