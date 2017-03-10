/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
// components and styles
import Card from 'components/Card'; // eslint-disable-line
import Seat from '../Seat'; // eslint-disable-line
// config data
import {
  SEAT_COORDS,
  AMOUNT_COORDS,
  ABI_TABLE,
  ABI_TOKEN_CONTRACT,
  tokenContractAddress,
} from '../../app.config';

import { modalAdd } from '../App/actions';
// actions
import {
  poll,
  lineupReceived,
  processNetting,
  resizeTable,
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
  makeAmountToCallSelector,
  makeHandSelector,
  makeLineupSelector,
  makeMyPosSelector,
  makeNetRequestSelector,
  makeComputedSelector,
} from './selectors';

import TableComponent from '../../components/Table';
import JoinDialog from '../JoinDialog';
import web3Connect from '../AccountProvider/web3Connect';
import TableService from '../../services/tableService';

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
    this.handleResize = this.handleResize.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.tableAddr = props.params.tableAddr;
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);

    // set initial size && resizing table
    window.onresize = this.handleResize;
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    // this.tableEvents.watch(this.watchTable);

    this.tokenEvents = this.token.allEvents({ fromBlock: 'latest' });
    // this.tokenEvents.watch(this.watchToken);

    // getting initial lineup from contract
    getTableData(this.table, props).then(() => {
      this.interval = setInterval(() => {
        props.poll(this.tableAddr);
      }, 3000);
    });
  }

  componentDidMount() {
    this.handleResize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hand && nextProps.lastHandNettedOnClient < this.props.hand.handId - 1) {
      this.props.updateLastHand(this.tableAddr, nextProps.lastHandNettedOnClient + 1);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.tableEvents.stopWatching();
    this.tokenEvents.stopWatching();
  }

  handleJoin(pos, amount) {
    this.token.approve.sendTransaction(this.tableAddr, amount);
    this.table.join.sendTransaction(amount, this.props.signerAddr, pos, '');
  }

  handleLeave() {
    const handId = parseInt(this.props.params.handId, 10);
    const exitHand = handId - 1;
    const table = new TableService(this.props.params.tableAddr, this.props.privKey);
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
      const errorElement = (<p>{errorElement}/</p>);
      this.props.modalAdd(errorElement);
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
  }

  renderSeats() {
    const seats = [];
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    if (!lineup) {
      return (<div></div>);
    }
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
          onClick={() => {
            if (open) {
              this.props.modalAdd((
                <JoinDialog pos={i} handleJoin={this.handleJoin} />
              ));
            }
            return null;
          }}
        >
        </Seat>);
      seats.push(seat);
    }
    return seats;
  }

  renderBoard() {
    const board = [];
    if (!this.props.hand) {
      return (<div></div>);
    }
    const cards = this.props.hand.get('cards');
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
    const seats = this.renderSeats();
    const board = this.renderBoard();
    const sb = (this.props.data && this.props.data.get('smallBlind')) ? this.props.data.get('smallBlind') : 0;
    return (
      <div>
        { this.props.hand &&
        <TableComponent
          {...this.props}
          sb={sb} board={board}
          seats={seats}
          onLeave={this.handleLeave}
          computedStyles={this.props.computedStyles}
        >
        </TableComponent> }
      </div>
    );
  }
}


export function mapDispatchToProps() {
  return {
    poll: (tableAddr) => (poll(tableAddr)),
    lineupReceived: (tableAddr, lineup, smallBlind) => (lineupReceived(tableAddr, lineup, smallBlind)),
    modalAdd: (node) => (modalAdd(node)),
    processNetting: (netRequest, handId, privKey, tableAddr) => (processNetting(netRequest, handId, privKey, tableAddr)),
    resizeTable: (computed, tableAddr) => (resizeTable(computed, tableAddr)),
  };
}

const mapStateToProps = createStructuredSelector({
  hand: makeHandSelector(),
  data: makeTableDataSelector(),
  lineup: makeLineupSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  potSize: makePotSizeSelector(),
  myPos: makeMyPosSelector(),
  privKey: makeSelectPrivKey(),
  signerAddr: makeSignerAddrSelector(),
  amountToCall: makeAmountToCallSelector(),
  proxyAddr: makeSelectProxyAddr(),
  netRequest: makeNetRequestSelector(),
  computedStyles: makeComputedSelector(),
});

Table.propTypes = {
  hand: React.PropTypes.object,
  lineup: React.PropTypes.object,
  params: React.PropTypes.object,
  updateLastHand: React.PropTypes.func,
  privKey: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  poll: React.PropTypes.func,
  web3Redux: React.PropTypes.any,
  data: React.PropTypes.any,
  computedStyles: React.PropTypes.object,
  modalAdd: React.PropTypes.func,
  processNetting: React.PropTypes.func,
  netRequest: React.PropTypes.func,
  resizeTable: React.PropTypes.func,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
