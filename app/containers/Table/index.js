/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { connect } from 'react-redux';
// components and styles
import Card from 'components/Card'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-line
import ActionBar from '../ActionBar'; // eslint-disable-line
// actions
import { startPolling, getLineup } from './actions';
// selectors
import { makeSelectAddress, makeSelectPrivKey } from '../AccountProvider/selectors';
import { makeIsMyTurnSelector, makePotSizeSelector, makeAmountToCallSelector,
         makeHandSelector, makeLastHandNettedSelector } from './selectors';


export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    const tableAddr = this.props.params.addr;
    const priv = this.props.priv;
    this.props.getLineup(tableAddr, priv);
    this.props.startPolling(tableAddr);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hand && nextProps.lastHandNettedOnClient < this.props.hand.handId - 1) {
      this.props.updateLastHand(nextProps.lastHandNettedOnClient + 1, this.props.params.addr);
    }
  }


  renderSeats() {
    const seats = [];
    const lineup = this.props.hand.lineup;
    for (let i = 0; i < lineup.length; i += 1) {
      const seat = (<Seat key={i} pos={i} > </Seat>);
      seats.push(seat);
    }
    return seats;
  }

  renderBoard() {
    const board = [];
    const cards = this.props.hand.cards;
    if (cards && cards.length > 0) {
      for (let i = 0; i < cards.length; i += 1) {
        const card = (<Card key={i} cardNumber={cards[i]}></Card>);
        board.push(card);
      }
    }
    return board;
  }

  render() {
    if (this.props.hand) {
      const seats = this.renderSeats();
      const board = this.renderBoard();
      return (
        <div id="root" className="table-bg">
          <div className="status">
            <h3>handstate: { this.props.hand.state } </h3>
            <h3>myAddress: { this.props.myAddress } </h3>
            <h3>isMyTurn: {(this.props.isMyTurn) ? 'yes' : 'no'} </h3>
            <h3>amount to call: { this.props.amountToCall} </h3>
            <h3>pot: { this.props.potSize} </h3>
          </div>
          <div className="table-container">
            <div className="poker-table">
              { seats }
              <div className="board">
                <div className="row">
                  { board }
                </div>
              </div>
            </div>
            <ActionBar></ActionBar>
          </div>
        </div>
      );
    }
    return null;
  }
}


export function mapDispatchToProps(dispatch) {
  return {
    updateLastHand: (handId, tableAddr) => dispatch({ type: 'GET_HAND_REQUESTED', payload: { handId, tableAddr } }),
    startPolling: (tableAddr) => dispatch(startPolling(tableAddr)),
    getLineup: (tableAddr, priv) => dispatch(getLineup(tableAddr, priv)),
  };
}

const mapStateToProps = (state) => ({
  priv: makeSelectPrivKey(),
  hand: makeHandSelector(state),
  myAddress: makeSelectAddress(state),
  lastHandNettedOnClient: makeLastHandNettedSelector(state),
  isMyTurn: makeIsMyTurnSelector(state),
  potSize: makePotSizeSelector(state),
  amountToCall: makeAmountToCallSelector(state),
});

Table.propTypes = {
  priv: React.PropTypes.string,
  hand: React.PropTypes.object,
  myAddress: React.PropTypes.string,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  isMyTurn: React.PropTypes.bool,
  potSize: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  updateLastHand: React.PropTypes.func,
  startPolling: React.PropTypes.func,
  getLineup: React.PropTypes.func,
};


export default connect(mapStateToProps, mapDispatchToProps)(Table);
