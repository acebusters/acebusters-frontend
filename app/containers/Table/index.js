/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Pusher from 'pusher-js';
import Raven from 'raven-js';
import { FormattedMessage } from 'react-intl';
import { Receipt } from 'poker-helper';

// components and styles
import TableDebug from '../../containers/TableDebug';

import Card from '../../components/Card';
import { BoardCardWrapper } from '../../components/Table/Board';
import Seat from '../Seat';
import Button from '../../components/Button';
import Slides from '../../components/Slides';
import { nickNameByAddress } from '../../services/nicknames';
import messages from './messages';
import { formatNtz } from '../../utils/amountFormatter';

// config data
import {
  ABI_TABLE,
  ABI_TOKEN_CONTRACT,
  TIMEOUT_PERIOD,
  conf,
} from '../../app.config';

import { modalAdd, modalDismiss } from '../App/actions';
// actions
import {
  handRequest,
  lineupReceived,
  updateReceived,
  addMessage,
  setPending,
  setExitHand,
  sitOutToggle,
  bet,
} from './actions';
// selectors
import makeSelectAccountData, {
  makeSelectPrivKey,
  makeSelectProxyAddr,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';

import {
  makeLastReceiptSelector,
} from '../Seat/selectors';

import {
  makeTableDataSelector,
  makeIsMyTurnSelector,
  makeAmountInTheMiddleSelector,
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
import JoinSlides from '../JoinDialog/slides';
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
    this.handleJoinComplete = this.handleJoinComplete.bind(this);
    this.handleRebuy = this.handleRebuy.bind(this);
    this.isTaken = this.isTaken.bind(this);

    this.tableAddr = props.params.tableAddr;
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
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
    this.tableService = new TableService(this.props.params.tableAddr, this.props.privKey);
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
          this.tableService.timeOut().then((res) => {
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

    // Note: with wsProvider, the request made by stopWatching will throw an error
    try {
      this.tableEvents.stopWatching();
    } catch (e) {
      this.tableEvents = null;
    }
  }

  handleUpdate(event) {
    if (event.type === 'chatMessage') {
      const msg = Receipt.parse(event.payload);
      this.props.addMessage(msg.message, msg.tableAddr, msg.signer, msg.created);
    } else if (event.type === 'handUpdate') {
      this.props.updateReceived(this.tableAddr, event.payload);
    } else if (event.type === 'joinRequest') {
      if (event.payload.signer !== this.props.signerAddr) {
        const data = event.payload.data.slice(2);
        const amount = parseInt(data.slice(8, 72), 16);
        const pos = parseInt(data.slice(136), 16) - 1;
        this.props.setPending(
          this.tableAddr,
          this.props.params.handId,
          pos,
          { signerAddr: event.payload.signer, stackSize: amount },
        );
      }
    }
  }

  handleRebuy(amount) {
    this.table.rebuy.sendTransaction(amount);

    const slides = (
      <Slides width={600} height={400}>
        <div>
          <h1>Request for rebuy sent! Please wait!</h1>
          <p>Here is the introduction to the online poker game</p>
        </div>
        <div>
          <h1>FAQ</h1>
        </div>
      </Slides>
    );

    this.props.modalDismiss();
    this.props.modalAdd(slides);
  }

  handleJoin(pos, amount) {
    const { signerAddr } = this.props;

    this.token.transData.sendTransaction(
      this.tableAddr,
      amount,
      `0x0${(pos).toString(16)}${signerAddr.replace('0x', '')}`
    );

    const slides = (
      <div>
        <JoinSlides></JoinSlides>
        <Button size="large" onClick={this.props.modalDismiss}>
          <FormattedMessage {...messages.joinModal.buttonDismiss} />
        </Button>
      </div>
    );

    this.props.modalDismiss();
    this.props.modalAdd(slides);
    this.props.setPending(
      this.tableAddr,
      this.props.params.handId,
      pos,
      { signerAddr: this.props.signerAddr, stackSize: amount }
    );
  }

  isTaken(open, myPos, pending, pos) {
    if (!this.props.account.loggedIn) {
      const loc = this.props.location;
      const curUrl = `${loc.pathname}${loc.search}${loc.hash}`;

      browserHistory.push(`/login?redirect=${curUrl}`);
      return;
    }

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
    // Note: sitout value possibilities
    //    sitout > 0, for enabled "play"
    //    sitout === 0, for disabled "play"
    //    sitout === undefined, for enabled "pause"
    //    sitout === null, for disabled "pause"
    // And we are only able to toggle sitout when it's enabled.
    const sitout = this.props.sitout;

    if (sitout !== undefined && sitout <= 0) return null;
    if (this.props.sitoutAmount <= -1) return null;

    // Note: if it's enabled "play" (> 0), then set it to disabled "pause" (null)
    // otherwise it's enabled "pause", then set it to disabled "play" (0)
    const nextSitoutState = sitout > 0 ? null : 0;
    const handId = parseInt(this.props.params.handId, 10);

    const sitoutAction = bet(
      this.props.params.tableAddr,
      handId,
      this.props.sitoutAmount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt,
      {
        originalSitout: sitout,
        nextSitoutState,
      }
    );
    return sitOutToggle(sitoutAction, this.props.dispatch);
  }

  handleLeave(pos) {
    const handId = parseInt(this.props.params.handId, 10);
    const state = this.props.state;
    const exitHand = (state !== 'waiting') ? handId : handId - 1;
    this.props.setExitHand(this.tableAddr, this.props.params.handId, pos, exitHand);
    const statusElement = (<div>
      <p>
        Please wait until your leave request is processed!
        Until then your status will be shown as pending.
      </p>
      <Button onClick={this.props.modalDismiss}>OK!</Button>
    </div>);

    this.props.modalDismiss();
    this.props.modalAdd(statusElement);

    return this.tableService.leave(exitHand).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
    });
  }

  handleJoinComplete() {
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    if (lineup && this.props.state !== 'waiting' && typeof lineup[this.props.myPos].sitout === 'number') {
      const handId = parseInt(this.props.params.handId, 10);
      const sitoutAction = bet(this.props.params.tableAddr, handId, 1, this.props.privKey, this.props.myPos);
      sitOutToggle(sitoutAction, this.props.dispatch);
    }
    this.props.modalDismiss();
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
        const lineupReceivedArgs = (rsp) => [
          this.tableAddr,
          rsp,
          this.props.data.get('smallBlind'),
          this.props.params.handId,
        ];

        if (result.args && result.args.addr === this.props.proxyAddr) {
          // notify backend about change in lineup
          this.tableService.lineup();
        }

        // update lineup when join successful
        this.table.getLineup.callPromise().then((rsp) => {
          this.props.lineupReceived(...lineupReceivedArgs(rsp));
        });

        break;
      }

      case 'Leave': {
        // notify backend about change in lineup
        this.tableService.lineup();
        break;
      }

      case 'NettingRequest': {
        // disptach action to sign netting request
        break;
      }

      case 'Error': {
        if (!result.args || result.args.addr !== this.props.proxyAddr) break;

        let msg = 'Ups Something went wrong';
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

  renderSeats(lineup, changed) {
    const seats = [];

    if (!lineup) {
      return seats;
    }
    for (let i = 0; i < lineup.length; i += 1) {
      const sitout = lineup[i].sitout;
      seats.push(
        <Seat
          key={i}
          pos={i}
          sitout={sitout}
          signerAddr={lineup[i].address}
          params={this.props.params}
          changed={changed}
          isTaken={this.isTaken}
        />
      );
    }
    return seats;
  }

  renderBoard() {
    const board = [];
    const cards = this.props.board;
    const cardSize = 50;
    if (cards && cards.length > 0) {
      for (let i = 0; i < cards.length; i += 1) {
        board.push(
          <BoardCardWrapper key={i}>
            <Card cardNumber={cards[i]} size={cardSize} />
          </BoardCardWrapper>
        );
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
        return (<div key={index}>{nickNameByAddress(winner.addr)} won {formatNtz(winner.amount - winner.maxBet)}  NTZ {handString}</div>);
      });
    }
    const sb = (this.props.data && this.props.data.get('smallBlind')) ? this.props.data.get('smallBlind') : 0;
    const pending = (lineup && lineup[this.props.myPos]) ? lineup[this.props.myPos].pending : false;
    return (
      <div>
        <TableDebug
          contract={this.table}
          tableService={this.tableService}
        />

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
          hand={this.props.hand}
          potSize={this.props.potSize}
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
    handRequest,
    lineupReceived,
    modalAdd,
    modalDismiss,
    setPending,
    setExitHand,
    updateReceived,
    addMessage,
  };
}

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  board: makeBoardSelector(),
  data: makeTableDataSelector(),
  hand: makeHandSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  lineup: makeLineupSelector(),
  latestHand: makeLatestHandSelector(),
  lastReceipt: makeLastReceiptSelector(),
  missingHands: makeMissingHandSelector(),
  myHand: makeMyHandValueSelector(),
  myPos: makeMyPosSelector(),
  potSize: makeAmountInTheMiddleSelector(),
  privKey: makeSelectPrivKey(),
  proxyAddr: makeSelectProxyAddr(),
  sitoutAmount: makeSitoutAmountSelector(),
  state: makeHandStateSelector(),
  signerAddr: makeSignerAddrSelector(),
  sitout: makeMySitoutSelector(),
  winners: makeSelectWinners(),
});

Table.propTypes = {
  state: React.PropTypes.string,
  board: React.PropTypes.array,
  hand: React.PropTypes.object,
  myHand: React.PropTypes.object,
  lineup: React.PropTypes.object,
  sitout: React.PropTypes.any,
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  lastReceipt: React.PropTypes.string,
  latestHand: React.PropTypes.any,
  missingHands: React.PropTypes.any,
  sitoutAmount: React.PropTypes.number,
  proxyAddr: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  web3Redux: React.PropTypes.any,
  data: React.PropTypes.any,
  myPos: React.PropTypes.any,
  potSize: React.PropTypes.number,
  modalAdd: React.PropTypes.func,
  handRequest: React.PropTypes.func,
  setPending: React.PropTypes.func,
  setExitHand: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  winners: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
  updateReceived: React.PropTypes.func,
  addMessage: React.PropTypes.func,
  location: React.PropTypes.object,
  account: React.PropTypes.object,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
