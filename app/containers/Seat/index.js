/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as LocalStorage from '../../services/localStorage';
import { setCards } from '../Table/actions';
import {
  makeCardSelector,
  makeLastAmountSelector,
  makeFoldedSelector,
  makeWhosTurnSelector,
  makeLastActionSelector,
} from './selectors';

import {
  makeMyPosSelector,
  makeHandSelector,
  makeLastHandNettedSelector,
  makeLineupSelector,
  makeStackSelector,
} from '../Table/selectors';

import SeatComponent from '../../components/Seat';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    if (this.props.whosTurn === this.props.pos && !this.interval) {
      this.interval = setInterval(() => {
        let timeLeft;
        if (this.props.hand && this.props.hand.get('changed')) {
          const deadline = this.props.hand.get('changed') + 60;
          timeLeft = deadline - Math.floor(Date.now() / 1000);
          this.setState({ timeLeft });
        }
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Saving holecards for the hand
    if (nextProps.hand && nextProps.hand.lineup
            && nextProps.hand.lineup[this.props.pos]
            && nextProps.hand.lineup[this.props.pos].last // this will not exist in handComplete, so cards will not be saved by accident
            && nextProps.hand.lineup[this.props.pos].cards) {
      const key = `${this.props.params.id}-${this.props.hand.handId}-${this.props.pos}`;
      LocalStorage.setItem(key, nextProps.hand.lineup[this.props.pos].cards);
    }

    if (nextProps.hand && nextProps.hand.lineup && nextProps.hand.lineup[this.props.pos] && !nextProps.hand.lineup[this.props.pos].cards && !this.cards) {
      const key = `${this.props.params.tableAddr}-${this.props.params.handId}-${this.props.pos}`;
      this.cards = LocalStorage.getItem(key);
      if (this.cards && this.cards.length === 2) { this.props.setCards(this.props.tableAddr, this.props.params.handId, this.cards, this.props.pos); }
    }
  }

  render() {
    const timeLeft = (this.state) ? this.state.timeLeft : 0;
    return (
      <SeatComponent {...this.props} timeLeft={timeLeft}></SeatComponent>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  lineup: makeLineupSelector(),
  lastHandNettedOnClient: makeLastHandNettedSelector(),
  myPos: makeMyPosSelector(),
  whosTurn: makeWhosTurnSelector(),
  lastAmount: makeLastAmountSelector(),
  cards: makeCardSelector(),
  folded: makeFoldedSelector(),
  lastAction: makeLastActionSelector(),
  stackSize: makeStackSelector(),
});


export function mapDispatchToProps(dispatch) {
  return {
    setCards: (tableAddr, handId, cards, pos) => dispatch(setCards(tableAddr, handId, cards, pos)),
  };
}

Seat.propTypes = {
  pos: React.PropTypes.number,
  tableAddr: React.PropTypes.string,
  hand: React.PropTypes.object,
  params: React.PropTypes.object,
  setCards: React.PropTypes.func,
  whosTurn: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
