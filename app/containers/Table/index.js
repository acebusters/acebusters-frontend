/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Pusher from 'pusher-js';
import Raven from 'raven-js';
// components and styles
import Card from '../../components/Card';
import { BoardCardWrapper } from '../../components/Table/Board';
import Seat from '../Seat';
import Button from '../../components/Button';
import Slides from '../../components/Slides';

// config data
import {
  ABI_TABLE,
  ABI_TOKEN_CONTRACT,
  TIMEOUT_PERIOD,
  tokenContractAddress,
} from '../../app.config';

import { modalAdd, modalDismiss } from '../App/actions';
// actions
import {
  handRequest,
  lineupReceived,
  updateReceived,
  pendingToggle,
  sitOutToggle,
  bet,
} from './actions';
// selectors
import {
  makeSelectPrivKey,
  makeSelectProxyAddr,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';

import {
  makeLastReceiptSelector,
} from '../Seat/selectors';

import { blockNotify } from '../AccountProvider/actions';

import {
  makeTableDataSelector,
  makeIsMyTurnSelector,
  makePotSizeSelector,
  makeBoardSelector,
  makeHandSelector,
  makeHandStateSelector,
  makeLineupSelector,
  makeMyHandValueSelector,
  makeMyPosSelector,
  makeSitoutAmountSelector,
  makeMissingHandSelector,
  makeMySitoutSelector,
  makeLatestHandSelector,
  makeSelectWinners,
} from './selectors';

import TableComponent from '../../components/Table';
import web3Connect from '../AccountProvider/web3Connect';
import TableService, { getHand } from '../../services/tableService';
import JoinDialog from '../JoinDialog';
import InviteDialog from '../InviteDialog';

const getTableData = (table, props) => {
  const lineup = table.getLineup.callPromise();
  const sb = table.smallBlind.callPromise();
  return Promise.all([lineup, sb]).then((rsp) => {
    props.lineupReceived(table.address, rsp[0], rsp[1]);
    return Promise.resolve();
  });
};

export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.watchTable = this.watchTable.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleSitout = this.handleSitout.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.isTaken = this.isTaken.bind(this);

    this.tableAddr = props.params.tableAddr;
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    this.tableEvents.watch(this.watchTable);

    // getting table data from oracle
    this.pusher = new Pusher('d4832b88a2a81f296f53', { cluster: 'eu', encrypted: true });
    this.channel = this.pusher.subscribe(this.tableAddr);
    getTableData(this.table, props).then(() => {
      this.props.handRequest(this.tableAddr, props.params.handId); // get initial state
      this.channel.bind('update', this.handleUpdate); // bind to future state updates
    });
    const handId = parseInt(this.props.params.handId, 10);
    Raven.setTagsContext({
      tableAddr: this.tableAddr,
      handId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const handId = parseInt(this.props.params.handId, 10);
    // take care of timing out players
    if (this.props.myPos !== undefined && this.props.hand
      && this.props.hand.get('changed') < nextProps.hand.get('changed')) {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }

      let passed = Math.floor(Date.now() / 1000) - nextProps.hand.get('changed');
      passed = (passed > TIMEOUT_PERIOD) ? TIMEOUT_PERIOD : passed;
      const random = (Math.random() * 9000);
      const timeOut = ((TIMEOUT_PERIOD * 1000) - (passed * 1000)) + random;

      if (timeOut > 0) {
        this.timeOut = setTimeout(() => {
          const table = new TableService(this.props.params.tableAddr);
          table.timeOut().then((res) => {
            Raven.captureMessage(`timeout: ${res}`, { tags: {
              tableAddr: this.props.params.tableAddr,
              handId,
            } });
          });
        }, timeOut);
      }
    }

    // get balance of player
    this.balance = this.token.balanceOf(this.props.proxyAddr);
    if (!this.balance && nextProps.proxyAddr) {
      this.token.balanceOf.call(nextProps.proxyAddr);
    }

    // show winner and forward browser to url of next hand
    this.pushed = (this.pushed) ? this.pushed : {};
    if (nextProps.latestHand) {
      const nextHandStr = nextProps.latestHand.toString();
      if (nextProps.latestHand > handId && !this.pushed[nextHandStr]) {
        this.pushed[nextHandStr] = true;
        setTimeout(() => {
          browserHistory.push(`/table/${this.tableAddr}/hand/${nextHandStr}`);
        }, 2000);
      }
    }


    // fetch hands that we might need for stack calculation
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
    if (this.timeOut) {
      clearInterval(this.timeOut);
    }
    this.channel.unbind('update', this.handleUpdate);
    this.tableEvents.stopWatching();
  }

  handleUpdate(hand) {
    this.props.updateReceived(this.tableAddr, hand);
  }

  handleJoin(pos, amount) {
    this.token.approve.sendTransaction(this.tableAddr, amount);
    this.table.join.sendTransaction(amount, this.props.signerAddr, pos + 1, '');

    const slides = (
      <Slides width={600} height={400}>
        <div>
          <h1>Request sent! Please wait!</h1>
          <p>Here is the introduction to the online poker game</p>
        </div>
        <div>
          <h1>FAQ</h1>
          <dl>
            <dt>Q: How long shall I wait before I can finally join the game?</dt>
            <dd>A: It depends on the blockchain network, normally it would take no more than 2 minutes</dd>
            <dt>Q: Why shall I wait for every moves I make?</dt>
            <dd>A: Blockchain the basis for this whole online poker game, and every move our users make are taken as a transaction. And each transaction need to be confirmed by the whole blockchain.</dd>
          </dl>
        </div>
      </Slides>
    );

    this.props.modalDismiss();
    this.props.modalAdd(slides);
    this.props.pendingToggle(this.tableAddr, this.props.params.handId, pos);
  }

  isTaken(open, myPos, pending, pos) {
    let balance;
    if (this.balance) {
      balance = parseInt(this.balance.toString(), 10);
    }
    if (open && myPos === undefined && !pending) {
      this.props.modalAdd((
        <JoinDialog
          pos={pos}
          handleJoin={this.handleJoin}
          modalDismiss={this.props.modalDismiss}
          params={this.props.params}
          balance={balance}
        />
      ));
    } else if (open && this.props.myPos !== undefined && !pending) {
      this.props.modalAdd((
        <InviteDialog />
      ));
    }
  }

  handleSitout() {
    const handId = parseInt(this.props.params.handId, 10);
    if (this.props.sitoutAmount > -1) {
      const sitoutAction = bet(this.props.params.tableAddr, handId, this.props.sitoutAmount, this.props.privKey, this.props.myPos, this.props.lastReceipt);
      return sitOutToggle(sitoutAction, this.props.dispatch);
    }
    return null;
  }

  handleLeave(pos) {
    const handId = parseInt(this.props.params.handId, 10);
    const state = this.props.state;
    const exitHand = (state !== 'waiting') ? handId : handId - 1;
    const table = new TableService(this.props.params.tableAddr, this.props.privKey);
    this.props.pendingToggle(this.tableAddr, this.props.params.handId, pos);
    const statusElement = (<div>
      <p>
        Please wait until your leave request is processed!
        Until then your status will be shown as pending.
      </p>
      <Button onClick={this.props.modalDismiss}>OK!</Button>
    </div>);
    this.props.modalAdd(statusElement);
    return table.leave(exitHand).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
    });
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
        if (result.args && result.args.addr === this.props.proxyAddr) {
          // notify backend about new block
          this.props.blockNotify();
          // show modal

          const statusElement = (<div>
            <h2>Join Successful!</h2>
            <Button onClick={this.props.modalDismiss}>OK!</Button>
          </div>);
          this.props.modalDismiss();
          this.props.modalAdd(statusElement);

          // update lineup when join successful
          this.table.getLineup.callPromise().then((rsp) => {
            this.props.lineupReceived(this.tableAddr, rsp, this.props.data.get('smallBlind'));
            for (let i = 0; i < rsp[1].length; i += 1) {
              if (rsp[1][i] === this.props.signerAddr) {
                this.props.pendingToggle(this.tableAddr, this.props.params.handId, i);
                break;
              }
            }
          });
        } else {
          // update lineup when when other players joined
          this.table.getLineup.callPromise().then((rsp) => {
            this.props.lineupReceived(this.tableAddr, rsp, this.props.data.get('smallBlind'));
          });
        }
        break;
      }

      case 'NettingRequest': {
        // disptach action to sign netting request
        break;
      }

      case 'Error': {
        let msg = 'Ups Something went wrong';
        const errorCode = result.args.errorCode.toNumber();
        this.props.pendingToggle(this.tableAddr, this.props.params.handId);
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

  renderSeats(lineup, changed) {
    const seats = [];

    if (!lineup) {
      return seats;
    }
    for (let i = 0; i < lineup.length; i += 1) {
      const sitout = lineup[i].sitout;
      const seat = (
        <Seat
          key={i}
          pos={i}
          sitout={sitout}
          signerAddr={lineup[i].address}
          params={this.props.params}
          changed={changed}
          isTaken={this.isTaken}
        >
        </Seat>);
      seats.push(seat);
    }
    return seats;
  }

  renderBoard() {
    const board = [];
    const cards = this.props.board;
    const cardSize = 50;
    if (cards && cards.length > 0) {
      for (let i = 0; i < 5; i += 1) {
        const card = (
          <BoardCardWrapper key={i}>
            <Card key={i} cardNumber={cards[i]} size={cardSize} offset={[0, 0]}></Card>
          </BoardCardWrapper>
        );
        board.push(card);
      }
    }
    return board;
  }

  render() {
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    const changed = (this.props.hand) ? this.props.hand.get('changed') : null;
    const seats = this.renderSeats(lineup, changed);
    const board = this.renderBoard();
    let winners = [];
    if (this.props.winners && this.props.winners.length > 0) {
      winners = this.props.winners.map((winner, index) => {
        const handString = (winner.hand) ? `with ${winner.hand}` : '';
        return (<div key={index}>`${winner.addr} won ${winner.amount} ${handString}`</div>);
      });
    }
    const sb = (this.props.data && this.props.data.get('smallBlind')) ? this.props.data.get('smallBlind') : 0;
    const pending = (lineup && lineup[this.props.myPos]) ? lineup[this.props.myPos].pending : false;
    return (
      <div>
        { this.props.state &&
        <TableComponent
          {...this.props}
          id="table"
          sb={sb}
          winners={winners}
          myHand={this.props.myHand}
          pending={pending}
          sitout={this.props.sitout}
          board={board}
          seats={seats}
          onLeave={() => this.handleLeave(this.props.myPos)}
          onSitout={this.handleSitout}
        >
        </TableComponent> }
      </div>
    );
  }
}


export function mapDispatchToProps() {
  return {
    handRequest: (tableAddr, handId) => handRequest(tableAddr, handId),
    lineupReceived: (tableAddr, lineup, smallBlind) => (lineupReceived(tableAddr, lineup, smallBlind)),
    modalAdd: (node) => (modalAdd(node)),
    modalDismiss: () => (modalDismiss()),
    pendingToggle: (tableAddr, handId, pos) => (pendingToggle(tableAddr, handId, pos)),
    updateReceived: (tableAddr, hand) => (updateReceived(tableAddr, hand)),
    blockNotify: () => (blockNotify()),
  };
}

const mapStateToProps = createStructuredSelector({
  state: makeHandStateSelector(),
  hand: makeHandSelector(),
  board: makeBoardSelector(),
  myHand: makeMyHandValueSelector(),
  data: makeTableDataSelector(),
  sitoutAmount: makeSitoutAmountSelector(),
  lineup: makeLineupSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  potSize: makePotSizeSelector(),
  myPos: makeMyPosSelector(),
  latestHand: makeLatestHandSelector(),
  signerAddr: makeSignerAddrSelector(),
  privKey: makeSelectPrivKey(),
  sitout: makeMySitoutSelector(),
  lastReceipt: makeLastReceiptSelector(),
  proxyAddr: makeSelectProxyAddr(),
  winners: makeSelectWinners(),
  missingHands: makeMissingHandSelector(),
});

Table.propTypes = {
  state: React.PropTypes.string,
  board: React.PropTypes.array,
  hand: React.PropTypes.object,
  myHand: React.PropTypes.object,
  lineup: React.PropTypes.object,
  sitout: React.PropTypes.bool,
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  lastReceipt: React.PropTypes.string,
  sitoutAmount: React.PropTypes.number,
  proxyAddr: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  web3Redux: React.PropTypes.any,
  data: React.PropTypes.any,
  myPos: React.PropTypes.any,
  modalAdd: React.PropTypes.func,
  blockNotify: React.PropTypes.func,
  handRequest: React.PropTypes.func,
  pendingToggle: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  winners: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
  updateReceived: React.PropTypes.func,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
