/**
 * Created by helge on 24.08.16.
 */
// react + redux
import React from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Pusher from 'pusher-js';
import Raven from 'raven-js';
import { FormattedMessage } from 'react-intl';
import { Receipt } from 'poker-helper';
import * as storageService from '../../services/sessionStorage';

// components and styles
import TableDebug from '../../containers/TableDebug';
import NotFoundPage from '../../containers/NotFoundPage';

import Card from '../../components/Card';
import { BoardCardWrapper } from '../../components/Table/Board';
import Seat from '../Seat';
import Button from '../../components/Button';
import WithLoading from '../../components/WithLoading';
import { nickNameByAddress } from '../../services/nicknames';
import messages from './messages';
import { formatNtz } from '../../utils/amountFormatter';
import { promisifyContractCall } from '../../utils/promisifyContractCall';

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
  seatReserved,
  seatsReleased,
  reservationReceived,
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
  makeMyLastReceiptSelector,
  makeMyStackSelector,
  makeMyStandingUpSelector,
  makeMyPendingSeatSelector,
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
import TableService, { getHand, fetchTableState } from '../../services/tableService';
import * as reservationService from '../../services/reservationService';
import JoinDialog from '../JoinDialog';
import JoinSlides from '../JoinDialog/slides';
import InviteDialog from '../InviteDialog';
import RebuyDialog from '../RebuyDialog';

const SpinnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%)
`;

const getTableData = async (table, props) => {
  const lineup = await table.getLineup.callPromise();

  if (lineup[1].length === 0) {
    throw new Error('Table doesn\'t exists');
  }

  const [sb, reservation, tableState] = await Promise.all([
    table.smallBlind.callPromise(),
    reservationService.lineup(table.address),
    fetchTableState(table.address),
  ]);

  props.lineupReceived(table.address, lineup, sb);
  props.updateReceived(table.address, tableState);
  props.reservationReceived(table.address, reservation);
};

export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.watchTable = this.watchTable.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleSitout = this.handleSitout.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
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
    this.tableService = new TableService(this.props.params.tableAddr, this.props.privKey);

    this.state = {
      notFound: false,
    };
    getTableData(this.table, this.props)
      .then(
        () => this.channel.bind('update', this.handleUpdate), // bind to future state updates
        () => this.setState({ notFound: true }),
      );
  }

  componentWillReceiveProps(nextProps) {
    const handId = this.props.latestHand;
    const { isMyTurn } = nextProps;
    // # if player <out of turn>: send usual <timeout>
    if (
      !isMyTurn &&
      this.props.myPos !== undefined &&
      this.props.hand &&
      this.props.hand.get('changed') < nextProps.hand.get('changed')
    ) {
      // take care of timing out players
      if (this.timeOut) {
        clearTimeout(this.timeOut);
        this.timeOut = null;
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
    } else if (isMyTurn) { // # if player <in turn>: somebody else send <timeout>
      if (this.timeOut) {
        clearTimeout(this.timeOut);
        this.timeOut = null;
      }
    }

    // get balance of player
    this.balance = this.token.balanceOf(this.props.proxyAddr);
    if (!this.balance && nextProps.proxyAddr) {
      this.token.balanceOf.call(nextProps.proxyAddr);
    }

    // show winner and forward browser to url of next hand
    this.pushed = (this.pushed) ? this.pushed : {};

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

    const toggleKey = this.tableAddr + handId;
    // display Rebuy modal if state === 'waiting' and user stack is no greater than 0
    if (nextProps.state === 'waiting' && nextProps.myStack !== null && nextProps.myStack <= 0
        && (nextProps.state !== this.props.state || nextProps.myStack !== this.props.myStack)
        && !nextProps.standingUp && !storageService.getItem(`rebuyModal[${toggleKey}]`)) {
      const balance = this.balance;

      this.props.modalDismiss();
      this.props.modalAdd(
        <RebuyDialog
          pos={this.props.myPos}
          handleRebuy={this.handleRebuy}
          handleLeave={this.handleLeave}
          modalDismiss={this.props.modalDismiss}
          params={this.props.params}
          balance={balance && Number(balance.toString())}
        />,
        this.handleLeave
      );
    }
  }

  componentWillUnmount() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
      this.timeOut = null;
    }
    this.channel.unbind('update', this.handleUpdate);

    // Note: with wsProvider, the request made by stopWatching will throw an error
    // Note: passed callback prevents exception, but it should work even without callback
    // need to fix wsProvider
    this.tableEvents.stopWatching(() => null);
  }

  handleUpdate(event) {
    if (event.type === 'chatMessage') {
      const msg = Receipt.parse(event.payload);
      this.props.addMessage(msg.message, msg.tableAddr, msg.signer, msg.created);
    } else if (event.type === 'handUpdate') {
      this.props.updateReceived(this.tableAddr, event.payload);
    } else if (event.type === 'seatReserve') {
      this.props.seatReserved(this.tableAddr, event.payload);
    } else if (event.type === 'seatsRelease') {
      this.props.seatsReleased(this.tableAddr, event.payload);
    }
  }

  handleRebuy(amount) {
    const handId = this.props.latestHand;
    const toggleKey = this.tableAddr + handId;
    storageService.setItem(`rebuyModal[${toggleKey}]`, true);

    const { signerAddr, myPos, account } = this.props;

    const promise = promisifyContractCall(this.token.transData.sendTransaction)(
      this.tableAddr,
      amount,
      `0x0${(myPos).toString(16)}${signerAddr.replace('0x', '')}`
    );

    storageService.removeItem(`rebuyModal[${toggleKey}]`);

    return Promise.resolve(account.isLocked ? null : promise).then(() => {
      this.props.modalDismiss();
    });
  }

  async handleJoin(pos, amount) {
    const { signerAddr, account } = this.props;

    const promise = promisifyContractCall(this.token.transData.sendTransaction)(
      this.tableAddr,
      amount,
      `0x0${(pos).toString(16)}${signerAddr.replace('0x', '')}`,
    );

    const reserveSeat = async () => {
      const txHash = await promise;
      reservationService.reserve(
        this.tableAddr,
        pos,
        this.props.signerAddr,
        txHash,
        amount.toString(),
      );
    };

    if (!account.isLocked) {
      await reserveSeat();
    }

    const slides = (
      <div>
        <JoinSlides />
        <Button size="large" onClick={this.props.modalDismiss}>
          <FormattedMessage {...messages.joinModal.buttonDismiss} />
        </Button>
      </div>
    );

    this.props.modalDismiss();
    this.props.modalAdd(slides);
    this.props.setPending(
      this.tableAddr,
      this.props.latestHand,
      pos,
      { signerAddr: this.props.signerAddr, stackSize: amount }
    );

    if (account.isLocked) {
      await reserveSeat();
    }
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
    const handId = this.props.latestHand;

    const sitoutAction = bet(
      this.props.params.tableAddr,
      handId,
      this.props.sitoutAmount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt,
    );
    return sitOutToggle(sitoutAction, this.props.dispatch);
  }

  handleLeave(pos) {
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    const handId = this.props.latestHand;
    const state = this.props.state;
    const exitHand = (state !== 'waiting') ? handId : handId - 1;

    if (!lineup) {
      return Promise.reject('Lineup is empty');
    }

    this.props.setExitHand(this.tableAddr, this.props.latestHand, pos, exitHand);
    const statusElement = (<div>
      <p>
        Please wait until your leave request is processed!
        Until then your status will be shown as pending.
      </p>
      <Button onClick={this.props.modalDismiss}>OK!</Button>
    </div>);

    storageService.removeItem(`rebuyModal[${this.tableAddr + handId}]`);
    this.props.modalDismiss();
    this.props.modalAdd(statusElement);

    return this.tableService.leave(exitHand, lineup[pos].address).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
    });
  }

  watchTable(error, result) {
    if (error) {
      Raven.captureException(error, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId: this.props.latestHand,
      } });
      return;
    }

    // dispatch action according to event type
    switch (result.event) {
      case 'Join': {
        const lineupReceivedArgs = (rsp) => [
          this.tableAddr,
          rsp,
          this.props.data.get('smallBlind'),
          this.props.latestHand,
          this.props.myPendingSeat,
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
    if (this.state.notFound) {
      return <NotFoundPage />;
    }

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
          params={this.props.params}
          contract={this.table}
        />

        {!this.props.state &&
          <SpinnerWrapper>
            <WithLoading
              loadingSize="30px"
              type="inline"
              styles={{
                spinner: { color: '#FFF' },
              }}
              isLoading
            />
          </SpinnerWrapper>
        }

        {this.props.state &&
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
          />
        }
      </div>
    );
  }
}


export function mapDispatchToProps() {
  return {
    handRequest,
    lineupReceived,
    reservationReceived,
    seatsReleased,
    modalAdd,
    modalDismiss,
    setPending,
    setExitHand,
    updateReceived,
    addMessage,
    seatReserved,
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
  myLastReceipt: makeMyLastReceiptSelector(),
  missingHands: makeMissingHandSelector(),
  myHand: makeMyHandValueSelector(),
  myStack: makeMyStackSelector(),
  myPos: makeMyPosSelector(),
  potSize: makeAmountInTheMiddleSelector(),
  privKey: makeSelectPrivKey(),
  proxyAddr: makeSelectProxyAddr(),
  sitoutAmount: makeSitoutAmountSelector(),
  state: makeHandStateSelector(),
  signerAddr: makeSignerAddrSelector(),
  sitout: makeMySitoutSelector(),
  winners: makeSelectWinners(),
  standingUp: makeMyStandingUpSelector(),
  myPendingSeat: makeMyPendingSeatSelector(),
});

Table.propTypes = {
  state: React.PropTypes.string,
  board: React.PropTypes.array,
  hand: React.PropTypes.object,
  isMyTurn: React.PropTypes.bool,
  myHand: React.PropTypes.object,
  myStack: React.PropTypes.number,
  lineup: React.PropTypes.object,
  sitout: React.PropTypes.any,
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  lastReceipt: React.PropTypes.string,
  latestHand: React.PropTypes.any,
  missingHands: React.PropTypes.any,
  sitoutAmount: React.PropTypes.number,
  standingUp: React.PropTypes.bool,
  proxyAddr: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  web3Redux: React.PropTypes.any,
  data: React.PropTypes.any,
  myPos: React.PropTypes.any,
  potSize: React.PropTypes.number,
  modalAdd: React.PropTypes.func,
  setPending: React.PropTypes.func,
  setExitHand: React.PropTypes.func,
  modalDismiss: React.PropTypes.func,
  winners: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
  reservationReceived: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  seatReserved: React.PropTypes.func,
  seatsReleased: React.PropTypes.func,
  updateReceived: React.PropTypes.func,
  addMessage: React.PropTypes.func,
  location: React.PropTypes.object,
  account: React.PropTypes.object,
  myPendingSeat: React.PropTypes.number,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
