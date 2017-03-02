/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
// components and styles
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import Button from 'components/Button';
import Card from 'components/Card'; // eslint-disable-line
import Label from 'components/Label'; // eslint-disable-line
import Input from 'components/Input'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-line
// config data
import { SEAT_COORDS, AMOUNT_COORDS, ABI_TABLE, ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';

// actions
import {
  poll,
  lineupReceived,
  addToModal,
  dissmissFromModal,
  processNetting,
  smallBlindReceived,
} from './actions';
// selectors
import {
  makeAddressSelector,
  makeSelectPrivKey,
  makeSelectProxyAddr,
} from '../AccountProvider/selectors';

import {
  makeIsMyTurnSelector,
  makePotSizeSelector,
  makeAmountToCallSelector,
  makeHandSelector,
  makeLastHandNettedSelector,
  makeLineupSelector,
  makeMyPosSelector,
  makeModalStackSelector,
  makeNetRequestSelector,
  makeSbSelector,
} from './selectors';

import TableComponent from '../../components/Table';
import web3Connect from '../AccountProvider/web3Connect';


export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.tableAddr = props.params.id;
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    // getting initial lineup from contract
    this.getLineup();
    window.onresize = this.handleResize;
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    this.table.smallBlind.callPromise().then((res) => {
      this.props.smallBlindReceived(res.toNumber());
    });

    this.tableEvents.watch((error, result) => {
      if (error) {
        const errorElement = (<p>{error}/</p>);
        this.props.addToModal(errorElement);
        return;
      }

      // dispatch action according to event type
      switch (result.event) {
        case 'Join': {
          // update lineup when join successful
          this.getLineup();
          break;
        }

        case 'NettingRequest': {
          // disptach action to sign netting request
          this.props.processNetting(this.props.netRequest,
            this.props.hand.handId, this.props.privKey, this.props.params.id);
          break;
        }

        case 'Error': {
          let msg = 'Up Something went wrong';
          const errorCode = result.args.errorCode.toNumber();

          if (errorCode === 1) {
            msg = 'Wrong Amount';
          }

          if (errorCode === 2) {
            msg = 'Not enough Moniezz';
          }

          if (errorCode === 3) {
            msg = 'You are already in lineup';
          }

          if (errorCode === 4) {
            msg = 'Sorry the Seat is taken';
          }

          const errorElement = (
            <div>
              <h2>{msg}</h2>
              <Button onClick={() => this.props.dismissFromModal()}>Cancel</Button>
            </div>);

          this.props.addToModal(errorElement);
          break;
        }

        default: {
          break;
        }
      }
    });

    this.tokenEvents = this.token.allEvents({ fromBlock: 'latest' });
    this.tokenEvents.watch((error, result) => {
      if (error) {
        const errorElement = (<p>{errorElement}/</p>);
        this.props.addToModal(errorElement);
        return;
      }

      // dispatch action according to event type
      switch (result.event) {
        case 'Approval': {
          console.log('approved');
          break;
        }
        case 'Transfer': {
          console.log('transferred');
          break;
        }
        case 'Issuance': {
          console.log('issued');
          break;
        }

        default: {
          break;
        }
      }
    });

    this.interval = setInterval(() => {
      props.poll(this.tableAddr);
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

  getLineup() {
    this.table.getLineup.callPromise().then((lineup) => {
      this.props.lineupReceived(lineup, this.tableAddr);
    });
  }

  handleResize() {
    // dispatch resize window action
  }

  updateAmount(e) {
    this.setState({ joinAmount: parseInt(e.target.value, 0) });
  }

  openJoinDialog(pos, open) {
    if (!open) return;
    const content = (
      <div>
        <Label>Please Select Amount to Join</Label>
        <Input placeholder="amount" type="number" onChange={(e) => this.updateAmount(e)} />
        <Button onClick={() => this.join(pos, this.state.joinAmount)}>Join</Button>
        <Button onClick={() => this.props.dismissFromModal()}>Cancel</Button>
      </div>
    );
    this.props.addToModal(content);
  }

  join(pos, amount) {
    console.log(pos, amount);
    this.token.approve.sendTransaction(this.tableAddr, amount);
    this.table.join.sendTransaction(amount, this.props.myAddress, pos, '');
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
          onClick={() => this.openJoinDialog(i, open)}
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
    // Get last Modal Element
    const modalContent = this.props.modalStack[this.props.modalStack.length - 1];
    const seats = this.renderSeats();
    const board = this.renderBoard();
    return (
      <div>
        <TableComponent {...this.props} board={board} seats={seats}></TableComponent>
        { modalContent &&
          <ModalContainer>
            <ModalDialog>
              { modalContent }
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    );
  }
}


export function mapDispatchToProps() {
  return {
    updateLastHand: (handId, tableAddr) => ({ type: 'GET_HAND_REQUESTED', payload: { handId, tableAddr } }),
    poll: (tableAddr) => (poll(tableAddr)),
    lineupReceived: (lineup, tableAddr) => (lineupReceived(lineup, tableAddr)),
    addToModal: (node) => (addToModal(node)),
    dismissFromModal: () => (dissmissFromModal()),
    processNetting: (netRequest, handId, privKey, tableAddr) => (processNetting(netRequest, handId, privKey, tableAddr)),
    smallBlindReceived: (sb) => (smallBlindReceived(sb)),
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
  modalStack: makeModalStackSelector(),
  netRequest: makeNetRequestSelector(),
  smallBlind: makeSbSelector(),
});

Table.propTypes = {
  hand: React.PropTypes.object,
  lineup: React.PropTypes.array,
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  updateLastHand: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
  privKey: React.PropTypes.string,
  poll: React.PropTypes.func,
  web3Redux: React.PropTypes.any,
  myAddress: React.PropTypes.string,
  modalStack: React.PropTypes.array,
  addToModal: React.PropTypes.func,
  dismissFromModal: React.PropTypes.func,
  processNetting: React.PropTypes.func,
  netRequest: React.PropTypes.func,
  smallBlindReceived: React.PropTypes.func,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
