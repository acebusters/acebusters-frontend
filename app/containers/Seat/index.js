/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as LocalStorage from '../../services/localStorage';
import { setCards } from '../Table/actions';
import { makeCardSelector, makeLastAmountSelector, makeFoldedSelector, makeWhosTurnSelector, makeLastActionSelector } from './selectors';
import { makeMyPosSelector, makeHandSelector, makeLastHandNettedSelector } from '../Table/selectors';
import { makeAddressSelector } from '../AccountProvider/selectors';
import SeatComponent from '../../components/Seat';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
      const key = `${this.props.params.id}-${this.props.hand.handId}-${this.props.pos}`;
      this.cards = LocalStorage.getItem(key);
      if (this.cards && this.cards.length === 2) { this.props.setCards(this.cards, this.props.pos); }
    }
  }

  render() {
    return (
      <div>
        <SeatComponent {...this.props}></SeatComponent>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  lastHandNettedOnClient: makeLastHandNettedSelector(),
  myAddress: makeAddressSelector(),
  myPos: makeMyPosSelector(),
  whosTurn: makeWhosTurnSelector(),
  lastAmount: makeLastAmountSelector(),
  cards: makeCardSelector(),
  folded: makeFoldedSelector(),
  lastAction: makeLastActionSelector(),
});


export function mapDispatchToProps(dispatch) {
  return {
    setCards: (cards, pos) => dispatch(setCards(cards, pos)),
  };
}

Seat.propTypes = {
  pos: React.PropTypes.number,
  hand: React.PropTypes.object,
  params: React.PropTypes.object,
  setCards: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
