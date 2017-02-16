/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// components and styles
import Card from 'components/Card'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-line
import ActionBar from '../ActionBar'; // eslint-disable-line
// actions
import { poll, getLineup } from './actions';
// selectors
import { makeAddressSelector } from '../AccountProvider/selectors';
import { makeIsMyTurnSelector, makePotSizeSelector, makeAmountToCallSelector,
         makeHandSelector, makeLastHandNettedSelector, makeLineupSelector } from './selectors';
import TableComponent from '../../components/Table';
import H3 from '../../components/H3';


export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    const privKey = this.props.location.query.privKey;
    const tableAddr = this.props.params.id;
    this.props.getLineup(tableAddr, privKey);
    setInterval(() => {
      this.props.poll(tableAddr);
    }, 3000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hand && nextProps.lastHandNettedOnClient < this.props.hand.handId - 1) {
      this.props.updateLastHand(nextProps.lastHandNettedOnClient + 1, this.props.params.id);
    }
  }

  renderSeats() {
    const seats = [];
    const lineup = this.props.lineup;
    for (let i = 0; i < lineup.length; i += 1) {
      const seat = (<Seat key={i} pos={i} {...this.props}> </Seat>);
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
        <div>
          <div>
            <H3>handstate: { this.props.hand.state } </H3>
            <H3>myAddress: { this.props.myAddress } </H3>
            <H3>isMyTurn: {(this.props.isMyTurn) ? 'yes' : 'no'} </H3>
            <H3>amount to call: { this.props.amountToCall} </H3>
            <H3>pot: { this.props.potSize} </H3>
          </div>
          <TableComponent {...this.props} board={board} seats={seats}></TableComponent>
          <ActionBar {...this.props}></ActionBar>
        </div>
      );
    }
    return null;
  }
}


export function mapDispatchToProps(dispatch) {
  return {
    updateLastHand: (handId, tableAddr) => dispatch({ type: 'GET_HAND_REQUESTED', payload: { handId, tableAddr } }),
    poll: (tableAddr) => dispatch(poll(tableAddr)),
    getLineup: (tableAddr, priv) => dispatch(getLineup(tableAddr, priv)),
  };
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  myAddress: makeAddressSelector(),
  lineup: makeLineupSelector(),
  lastHandNettedOnClient: makeLastHandNettedSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  potSize: makePotSizeSelector(),
  amountToCall: makeAmountToCallSelector(),
});

Table.propTypes = {
  location: React.PropTypes.object,
  hand: React.PropTypes.object,
  lineup: React.PropTypes.array,
  myAddress: React.PropTypes.string,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  isMyTurn: React.PropTypes.bool,
  potSize: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  params: React.PropTypes.object,
  updateLastHand: React.PropTypes.func,
  poll: React.PropTypes.func,
  getLineup: React.PropTypes.func,
};


export default connect(mapStateToProps, mapDispatchToProps)(Table);
