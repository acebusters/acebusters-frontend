/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Pusher from 'pusher-js';
// components and styles
import Card from 'components/Card'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-lines
import Button from 'components/Button'; // eslint-disable-line
// config data
import {
  SEAT_COORDS,
  AMOUNT_COORDS,
  ABI_TABLE,
  ABI_TOKEN_CONTRACT,
  tokenContractAddress,
} from '../../app.config';

import { modalAdd, modalDismiss } from '../App/actions';
// actions
import {
  getInfo,
  lineupReceived,
  updateReceived,
  resizeTable,
  addPending,
  removePending,
} from './actions';
// selectors
import {
  makeSignerAddrSelector,
  makeSelectPrivKey,
  makeSelectProxyAddr,
} from '../AccountProvider/selectors';

import {
  makeTableDataSelector,
  makeIsMyTurnSelector,
  makePotSizeSelector,
  makeBoardSelector,
  makeHandSelector,
  makeAmountToCallSelector,
  makeHandStateSelector,
  makeLineupSelector,
  makeMyPosSelector,
  makeComputedSelector,
  makeMyMaxBetSelector,
  makeMissingHandSelector,
  makeLatestHandSelector,
} from './selectors';

import TableComponent from '../../components/Table';
import JoinDialog from '../JoinDialog';
import InviteDialog from '../InviteDialog';
import web3Connect from '../AccountProvider/web3Connect';
import TableService, { getHand } from '../../services/tableService';

const getTableData = (table, props) => {
  const lineup = table.getLineup.callPromise();
  const sb = table.smallBlind.callPromise();
  return Promise.all([lineup, sb]).then((rsp) => {
    props.lineupReceived(table.address, rsp[0], rsp[1]);
    return Promise.resolve();
  });
};

const computeStyles = (windowWidth, windowHeight, infoHeight, actionBarHeight) => {
  const computed = {};
  computed.d = windowWidth;
  computed.b = infoHeight;
  computed.h = 1.6;
  computed.a = 0.96;
  computed.e = 100;
  computed.f = computed.d - computed.b - computed.e;
  computed.l = computed.f;
  computed.g = windowHeight;
  computed.z = actionBarHeight;
  computed.y = computed.g - computed.z;
  computed.computeSize = () => {
    let k;
    let c;
    const obj = {};
    if (computed.y < computed.l / computed.h) {
      k = computed.y * computed.a;
      c = k * computed.h;
    } else {
      c = computed.l * computed.a;
      k = (c / computed.h);
    }
    obj.width = c;
    obj.height = k;
    return obj;
  };
  return computed;
};

export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.watchTable = this.watchTable.bind(this);
    this.watchToken = this.watchToken.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleSitout = this.handleSitout.bind(this);
    this.tableAddr = props.params.tableAddr;
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    // set initial size && resizing table
    window.onresize = this.handleResize;
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    this.tableEvents.watch(this.watchTable);

    this.tokenEvents = this.token.allEvents({ fromBlock: 'latest' });
    this.tokenEvents.watch(this.watchToken);

    // getting table data from oracle
    this.pusher = new Pusher('d4832b88a2a81f296f53', { cluster: 'eu', encrypted: true });
    this.channel = this.pusher.subscribe(this.tableAddr);
    getTableData(this.table, props).then(() => {
      this.props.getInfo(this.tableAddr); // get initial state
      this.channel.bind('update', this.handleUpdate); // bind to future state updates
    });
  }

  componentDidMount() {
    this.handleResize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.myPos > -1
      && this.props.hand
      && this.props.hand.get('changed') < nextProps.hand.get('changed')
      && nextProps.hand.get('state') !== 'waiting') {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
        console.log('timeout cancelled');
      }

      const random = (Math.random() * 9000);
      const timeOut = (nextProps.hand.get('changed') - Math.floor(Date.now() / 1000)) + 59000 + random;
      if (timeOut > 0) {
        console.log('timeout started');
        this.timeOut = setTimeout(() => {
          console.log('timeout fired');
          const table = new TableService(this.props.params.tableAddr);
          table.timeOut().then((res) => {
            console.log(res);
          });
        }, timeOut);
      }
    }

    const balance = this.token.balanceOf(this.props.proxyAddr);
    if (!balance && nextProps.proxyAddr) {
      this.token.balanceOf.call(nextProps.proxyAddr);
    }

    if (nextProps.latestHand > this.props.params.handId && !this.pushed) {
      this.pushed = true;
      setTimeout(() => {
        browserHistory.push(`/table/${this.tableAddr}/hand/${nextProps.latestHand}`);
      }, 1000);
    }

    if (nextProps.missingHands && nextProps.missingHands.length > 0) {
      this.getHandStarted = (this.getHandStarted) ? this.getHandStarted : {};
      for (let i = 0; i < nextProps.missingHands.length; i += 1) {
        if (!this.getHandStarted[nextProps.missingHands[i].toString()]) {
          this.getHandStarted[nextProps.missingHands[i].toString()] = true;
          getHand(this.tableAddr, nextProps.missingHands[i]).then((rsp) => {
            this.props.updateReceived(this.tableAddr, rsp);
          });
        }
      }
    }
  }

  componentWillUnmount() {
    this.channel.unbind('update', this.handleUpdate);
    this.tableEvents.stopWatching();
    this.tokenEvents.stopWatching();
  }

  handleJoin(pos, amount) {
    this.token.approve.sendTransaction(this.tableAddr, amount);
    this.table.join.sendTransaction(amount, this.props.signerAddr, pos + 1, '');
    const statusElement = (<div>
      <p> Request send. Waiting for the blockchain :)</p>
      <Button onClick={this.props.modalDismiss}>OK!</Button>
    </div>);
    this.props.modalDismiss();
    this.props.modalAdd(statusElement);
    this.props.addPending(this.tableAddr, this.props.params.handId, pos);
  }

  handleUpdate(hand) {
    this.props.updateReceived(this.tableAddr, hand);
  }

  handleSitout() {
    const handId = parseInt(this.props.params.handId, 10);
    const amount = (this.props.myMaxbet > -1) ? this.props.myMaxbet : 0;
    const table = new TableService(this.props.params.tableAddr, this.props.privKey);
    return table.sitOut(handId, amount).catch((err) => {
      console.log(err);
      // throw new SubmissionError({ _error: `Leave failed with error ${err}.` });
    });
  }

  handleLeave(pos) {
    const handId = parseInt(this.props.params.handId, 10);
    const state = this.props.state;
    const exitHand = (state !== 'waiting') ? handId : handId - 1;
    const table = new TableService(this.props.params.tableAddr, this.props.privKey);
    this.props.addPending(this.tableAddr, this.props.params.handId, pos);
    const statusElement = (<div>
      <p>
        Please wait until your leave request is processed!
        Until then your status will be shown as pending.
      </p>
      <Button onClick={this.props.modalDismiss}>OK!</Button>
    </div>);
    this.props.modalAdd(statusElement);
    return table.leave(exitHand).catch((err) => {
      console.log(err);
      // throw new SubmissionError({ _error: `Leave failed with error ${err}.` });
    });
  }

  handleResize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const infoHeight = (document.getElementById('table-info')) ? document.getElementById('table-info').clientWidth : 0;
    const actionBarHeight = (document.getElementById('action-bar')) ? document.getElementById('action-bar').clientHeight : 0;
    if (this.props) {
      this.props.resizeTable(computeStyles(windowWidth, windowHeight, infoHeight, actionBarHeight), this.tableAddr);
    }
  }


  watchTable(error, result) {
    if (error) {
      const errorElement = (<p>{error}/</p>);
      this.props.modalAdd(errorElement);
      return;
    }

    // dispatch action according to event type
    switch (result.event) {
      case 'Join': {
        // update lineup when join successful
        this.table.getLineup.call();
        getTableData(this.table, this.props);
        this.props.removePending(this.tableAddr, this.props.params.handId);
        this.props.modalDismiss();
        const statusElement = (<div>
          <h2>Join Successful!</h2>
          <Button onCLick={() => this.props.modalDismiss}>Ok!</Button>
        </div>);
        this.props.modalAdd(statusElement);
        break;
      }

      case 'NettingRequest': {
        // disptach action to sign netting request
        break;
      }

      case 'Error': {
        let msg = 'Ups Something went wrong';
        const errorCode = result.args.errorCode.toNumber();
        this.props.removePending(this.tableAddr, this.props.params.handId);
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
          </div>);

        this.props.modalAdd(errorElement);
        break;
      }

      default: {
        break;
      }
    }
  }

  watchToken(error, result) {
    if (error) {
      const errorElement = (<h2>{errorElement}/</h2>);
      this.props.modalAdd(errorElement);
      return;
    }

    // dispatch action according to event type
    switch (result.event) {
      case 'Approval': {
        this.props.modalDismiss();
        const statusElement = (<h2>Sufficient Balance</h2>);
        this.props.modalAdd(statusElement);
        break;
      }
      case 'Transfer': {
        this.props.modalDismiss();
        const statusElement = (<h2>Amount Transferred</h2>);
        this.props.modalAdd(statusElement);
        break;
      }
      case 'Issuance': {
        this.props.modalDismiss();
        const statusElement = (<h2>Amount Issued</h2>);
        this.props.modalAdd(statusElement);
        break;
      }

      default: {
        break;
      }
    }
  }

  renderSeats() {
    const seats = [];
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    const myPos = this.props.myPos;

    if (!lineup) {
      return (<div></div>);
    }

    let balance = this.token.balanceOf(this.props.proxyAddr);
    if (balance) {
      balance = balance.toString();
    }
    const coordArray = SEAT_COORDS[lineup.length.toString()];
    const amountCoords = AMOUNT_COORDS[lineup.length.toString()];
    for (let i = 0; i < lineup.length; i += 1) {
      const open = (lineup[i].address.indexOf('0x0000000000000000000000000000000000000000') > -1);
      const pending = lineup[i].pending;
      const seat = (
        <Seat
          key={i}
          pos={i}
          {...this.props}
          coords={coordArray[i]}
          amountCoords={amountCoords[i]}
          open={open}
          pending={pending}
          onClick={() => {
            if (open && myPos === -1 && !pending) {
              this.props.modalAdd((
                <JoinDialog
                  pos={i}
                  handleJoin={this.handleJoin}
                  params={this.props.params}
                  balance={balance}
                />
              ));
            } else if (open && myPos !== -1 && !pending) {
              this.props.modalAdd((
                <InviteDialog />
              ));
            }
          }}
        >
        </Seat>);
      seats.push(seat);
    }
    return seats;
  }

  renderBoard() {
    const board = [];
    const cards = this.props.board;
    const cardSize = 80;
    if (cards && cards.length > 0) {
      for (let i = 0; i < cards.length; i += 1) {
        const card = (<Card key={i} cardNumber={cards[i]} size={cardSize}></Card>);
        board.push(card);
      }
    }
    return board;
  }

  render() {
    // Get last Modal Element
    const seats = this.renderSeats();
    const board = this.renderBoard();
    const sb = (this.props.data && this.props.data.get('smallBlind')) ? this.props.data.get('smallBlind') : 0;
    return (
      <div>
        { this.props.state &&
        <TableComponent
          {...this.props}
          sb={sb}
          board={board}
          seats={seats}
          onLeave={() => this.handleLeave(this.props.myPos)}
          onSitout={this.handleSitout}
          computedStyles={this.props.computedStyles}
        >
        </TableComponent> }
      </div>
    );
  }
}


export function mapDispatchToProps() {
  return {
    getInfo: (tableAddr) => getInfo(tableAddr),
    lineupReceived: (tableAddr, lineup, smallBlind) => (lineupReceived(tableAddr, lineup, smallBlind)),
    modalAdd: (node) => (modalAdd(node)),
    modalDismiss: () => (modalDismiss()),
    addPending: (tableAddr, handId, pos) => (addPending(tableAddr, handId, pos)),
    removePending: (tableAddr, handId) => (removePending(tableAddr, handId)),
    resizeTable: (computed, tableAddr) => (resizeTable(computed, tableAddr)),
    updateReceived: (tableAddr, hand) => (updateReceived(tableAddr, hand)),
  };
}

const mapStateToProps = createStructuredSelector({
  state: makeHandStateSelector(),
  hand: makeHandSelector(),
  board: makeBoardSelector(),
  data: makeTableDataSelector(),
  lineup: makeLineupSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  potSize: makePotSizeSelector(),
  myPos: makeMyPosSelector(),
  latestHand: makeLatestHandSelector(),
  myMaxbet: makeMyMaxBetSelector(),
  privKey: makeSelectPrivKey(),
  signerAddr: makeSignerAddrSelector(),
  amountToCall: makeAmountToCallSelector(),
  proxyAddr: makeSelectProxyAddr(),
  computedStyles: makeComputedSelector(),
  missingHands: makeMissingHandSelector(),
});

Table.propTypes = {
  state: React.PropTypes.string,
  board: React.PropTypes.array,
  hand: React.PropTypes.object,
  lineup: React.PropTypes.object,
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  proxyAddr: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  getInfo: React.PropTypes.func,
  web3Redux: React.PropTypes.any,
  data: React.PropTypes.any,
  myPos: React.PropTypes.any,
  myMaxbet: React.PropTypes.number,
  computedStyles: React.PropTypes.object,
  modalAdd: React.PropTypes.func,
  addPending: React.PropTypes.func,
  removePending: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  resizeTable: React.PropTypes.func,
  updateReceived: React.PropTypes.func,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
