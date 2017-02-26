/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
// config data
import { SEAT_COORDS, AMOUNT_COORDS, ABI_TABLE, ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';
// components and styles
import Card from 'components/Card'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-line
import ActionBar from '../ActionBar'; // eslint-disable-line
// actions
import { poll, lineupReceived } from './actions';
// selectors
import { makeAddressSelector, makeSelectPrivKey, makeSelectProxyAddr } from '../AccountProvider/selectors';
import { makeIsMyTurnSelector, makePotSizeSelector, makeAmountToCallSelector,
         makeHandSelector, makeLastHandNettedSelector, makeLineupSelector, makeMyPosSelector } from './selectors';
import TableComponent from '../../components/Table';
import web3Connect from '../AccountProvider/web3Connect';


export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    // start polling data
    this.tableAddr = this.props.params.id;
    this.web3 = this.props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    // getting initial lineup from contract
    this.table.getLineup.callPromise().then((lineup) => {
      this.props.lineupReceived(lineup);
    });
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    this.tableEvents.watch((error, results) => {
      if (error) {
        console.log(error);
        return;
      }
      // dispatch action according to event type
      console.log(results);
    });

    this.tokenEvents = this.token.allEvents({ fromBlock: 'latest' });
    this.tokenEvents.watch((error, results) => {
      if (error) {
        console.log(error);
        return;
      }
      // dispatch action according to event type
      console.log(results);
    });

    this.interval = setInterval(() => {
      this.props.poll(this.tableAddr);
    }, 3000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hand && nextProps.lastHandNettedOnClient < this.props.hand.handId - 1) {
      this.props.updateLastHand(nextProps.lastHandNettedOnClient + 1, this.tableAddr);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.tableEvents.stopWatching();
    this.tokenEvents.stopWatching();
  }

  join(pos, open) {
    if (!open) return;
    this.token.approve.sendTransaction(this.tableAddr, 100000);
    this.table.join.sendTransaction(10000, this.props.myAddress, pos, '');
  }

  renderSeats() {
    const seats = [];
    const lineup = this.props.lineup;
    const coordArray = SEAT_COORDS[lineup.length.toString()];
    const amountCoords = AMOUNT_COORDS[lineup.length.toString()];

    for (let i = 0; i < lineup.length; i += 1) {
      const open = (lineup[i].address.indexOf('0x0000000000000000000000000000000000000000') > -1);
      const seat = (
        <Seat
          key={i}
          pos={i} {...this.props}
          coords={coordArray[i]}
          amountCoords={amountCoords[i]}
          open={open}
          onClick={() => this.join(i, open)}
        >
        </Seat>);
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
        <TableComponent {...this.props} board={board} seats={seats} ></TableComponent>
      );
    }
    return null;
  }
}


export function mapDispatchToProps() {
  return {
    updateLastHand: (handId, tableAddr) => ({ type: 'GET_HAND_REQUESTED', payload: { handId, tableAddr } }),
    poll: (tableAddr) => (poll(tableAddr)),
    lineupReceived: (lineup) => (lineupReceived(lineup)),
  };
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  myAddress: makeAddressSelector(),
  lineup: makeLineupSelector(),
  lastHandNettedOnClient: makeLastHandNettedSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  potSize: makePotSizeSelector(),
  myPos: makeMyPosSelector(),
  privKey: makeSelectPrivKey(),
  amountToCall: makeAmountToCallSelector(),
  proxyAddr: makeSelectProxyAddr(),
});

Table.propTypes = {
  hand: React.PropTypes.object,
  lineup: React.PropTypes.array,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  updateLastHand: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
  poll: React.PropTypes.func,
  web3Redux: React.PropTypes.any,
  myAddress: React.PropTypes.string,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
