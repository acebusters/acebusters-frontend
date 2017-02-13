/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { connect } from 'react-redux';
import Card from 'components/Card'; // eslint-disable-line
import * as LocalStorage from '../../services/localStorage';
import { setCards } from '../Table/actions';
import { makeCardSelector, makeStackSelector, makeLastAmountSelector, makeFoldedSelector } from './selectors';
import { makeMyPosSelector, makeHandSelector, makeLastHandNettedSelector } from '../Table/selectors';
import { makeSelectAddress } from '../AccountProvider/selectors';

class Seat extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    // Saving holecards for the hand
    if (nextProps.hand && nextProps.hand.lineup
            && nextProps.hand.lineup[this.props.pos]
            && nextProps.hand.lineup[this.props.pos].last // this will not exist in handComplete, so cards will not be saved by accident
            && nextProps.hand.lineup[this.props.pos].cards) {
      const key = `${this.props.tableAddr}-${this.props.hand.handId}-${this.props.pos}`;
      LocalStorage.setItem(key, nextProps.hand.lineup[this.props.pos].cards);
    }

    if (nextProps.hand && nextProps.hand.lineup && nextProps.hand.lineup[this.props.pos] && !nextProps.hand.lineup[this.props.pos].cards && !this.cards) {
      const key = `${this.props.tableAddr}-${this.props.hand.handId}-${this.props.pos}`;
      this.cards = LocalStorage.getItem(key);
      if (this.cards && this.cards.length === 2) { this.props.setCards(this.cards, this.props.pos); }
    }
  }

  render() {
    return (
      <div className={`seat taken pos-${this.props.pos}${this.props.myPos === this.props.pos ? ' turn' : ''}`}>
        <div className="player-name">{ this.props.myAddress }</div>
        <div className="betting-amount"> { this.props.lastAmount } </div>
        <div className="hole-cards row">
          { (!this.props.folded) ? <div> <Card cardNumber={this.props.cards[0]} ></Card><Card cardNumber={this.props.cards[1]}></Card></div> : null }
        </div>
        <div className="player-name">{ (this.props.lastHandNettedOnClient === this.props.hand.handId - 1) ? this.props.stack : null }</div>
      </div>
    );
  }
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => ({
    myAddress: makeSelectAddress(state),
    hand: makeHandSelector(state),
    lastHandNettedOnClient: makeLastHandNettedSelector(state),
    myPos: makeMyPosSelector(state),
    lastAmount: makeLastAmountSelector(state),
    stack: makeStackSelector(state),
    cards: makeCardSelector(state),
    folded: makeFoldedSelector(state),
  });

  return mapStateToProps;
};

export function mapDispatchToProps(dispatch) {
  return {
    setCards: (cards, pos) => dispatch(setCards(cards, pos)),
  };
}

Seat.propTypes = {
  pos: React.PropTypes.number,
  tableAddr: React.PropTypes.string,
  myAddress: React.PropTypes.string,
  hand: React.PropTypes.object,
  lastHandNettedOnClient: React.PropTypes.number,
  myPos: React.PropTypes.number,
  lastAmount: React.PropTypes.number,
  stack: React.PropTypes.number,
  cards: React.PropTypes.array,
  folded: React.PropTypes.bool,
  setCards: React.PropTypes.func,
};

export default connect(makeMapStateToProps)(Seat);
