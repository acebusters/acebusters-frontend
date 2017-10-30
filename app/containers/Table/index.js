import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Pusher from 'pusher-js';
import Raven from 'raven-js';
import { Receipt } from 'poker-helper';
import * as storageService from '../../services/sessionStorage';

// components and styles
import TableDebug from '../../containers/TableDebug';
import NotFoundPage from '../../containers/NotFoundPage';

import Card from '../../components/Card';
import { BoardCardWrapper } from '../../components/Table/Board';
import Seat from '../Seat';
import WithLoading from '../../components/WithLoading';
import { nickNameByAddress } from '../../services/nicknames';
import { formatNtz } from '../../utils/amountFormatter';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';

import { CONFIRM_DIALOG, JOIN_DIALOG, INVITE_DIALOG } from '../Modal/constants';

// config data
import {
  ABI_TABLE,
  ABI_TOKEN_CONTRACT,
  TIMEOUT_PERIOD,
  conf,
} from '../../app.config';

import messages from './messages';

import { modalAdd, modalDismiss } from '../App/actions';
// actions
import {
  loadTable,
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
  reserveSeat,
} from './actions';
// selectors
import makeSelectAccountData, {
  makeSelectPrivKey,
  makeSelectProxyAddr,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';

import {
  makeLastReceiptSelector,
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
  makeMySitoutSelector,
  makeLatestHandSelector,
  makeSelectWinners,
  makeMyLastReceiptSelector,
  makeTableLoadingStateSelector,
} from './selectors';

import TableComponent from '../../components/Table';
import web3Connect from '../AccountProvider/web3Connect';
import TableService from '../../services/tableService';

const SpinnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%)
`;

export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.watchTable = this.watchTable.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleSitout = this.handleSitout.bind(this);
    this.handleOpponentCall = this.handleOpponentCall.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.estimateJoin = this.estimateJoin.bind(this);
    this.handleRebuy = this.handleRebuy.bind(this);
    this.estimateRebuy = this.estimateRebuy.bind(this);
    this.isTaken = this.isTaken.bind(this);
    this.handleBeat = this.handleBeat.bind(this);

    this.table = this.web3.eth.contract(ABI_TABLE).at(this.tableAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
    // register event listener for table
    this.tableEvents = this.table.allEvents({ fromBlock: 'latest' });
    this.tableEvents.watch(this.watchTable);

    // getting table data from oracle
    this.pusher = new Pusher(conf().pusherApiKey, { cluster: 'eu', encrypted: true });
    this.channel = this.pusher.subscribe(this.tableAddr);
    this.tableService = new TableService(this.tableAddr, this.props.privKey);

    this.state = {
      notFound: false,
    };

    this.beatInterval = setInterval(this.handleBeat, 60000);
  }

  componentWillMount() {
    this.props.loadTable(this.tableAddr);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tableLoadingState === 'loading') {
      if (nextProps.tableLoadingState === 'success') {
        this.channel.bind('update', this.handleUpdate); // bind to future state updates
      } else if (nextProps.tableLoadingState === 'error') {
        this.setState({ notFound: true });
      }
    }

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

      const timeoutPeriod = TIMEOUT_PERIOD(nextProps.hand.get('state'));
      const passed = Math.min(
        Math.floor(Date.now() / 1000) - nextProps.hand.get('changed'),
        timeoutPeriod,
      );
      const timeOut = ((timeoutPeriod * 1000) - (passed * 1000)) + (Math.random() * 9000);

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

    const toggleKey = this.tableAddr + handId;
    // display Rebuy modal if state === 'waiting' and user stack is no greater than 0
    if (
      nextProps.state === 'waiting' &&
      nextProps.myStack !== null && nextProps.myStack <= 0 &&
      (
        nextProps.state !== this.props.state ||
        (nextProps.myStack !== this.props.myStack && this.props.myStack > 0)
      ) &&
      !nextProps.standingUp && !storageService.getItem(`rebuyModal[${toggleKey}]`)
    ) {
      const balance = this.balance;

      this.props.modalDismiss();
      this.props.modalAdd({
        modalType: JOIN_DIALOG,
        modalProps: {
          onJoin: this.handleRebuy,
          estimate: this.estimateRebuy,
          onLeave: () => this.handleLeave(this.props.myPos),
          params: this.props.params,
          balance: balance && Number(balance.toString()),
          rebuy: true,
        },
        closeHandler: this.handleLeave,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
    clearInterval(this.beatInterval);
    this.channel.unbind('update', this.handleUpdate);

    // Note: with wsProvider, the request made by stopWatching will throw an error
    // Note: passed callback prevents exception, but it should work even without callback
    this.tableEvents.stopWatching(() => null);
  }

  get tableAddr() {
    return this.props.params.tableAddr;
  }

  get web3() {
    return this.props.web3Redux.web3;
  }

  handleBeat() {
    if (
      this.props.state === 'waiting' &&
      this.props.myPos >= 0 &&
      this.props.myPendingSeat === -1 &&
      !this.props.standingUp &&
      !this.props.sitout
    ) {
      this.tableService.beat();
    }
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

    const promise = promisifyWeb3Call(this.token.transData.sendTransaction)(
      this.tableAddr,
      amount,
      `0x0${(myPos).toString(16)}${signerAddr.replace('0x', '')}`
    );


    return Promise.resolve(account.isLocked ? null : promise).then(() => {
      this.props.modalDismiss();
      storageService.removeItem(`rebuyModal[${toggleKey}]`);
    });
  }

  estimateRebuy(amount) {
    const { signerAddr, myPos } = this.props;

    return this.token.transData.estimateGas(
      this.tableAddr,
      amount,
      `0x0${(myPos).toString(16)}${signerAddr.replace('0x', '')}`
    );
  }

  async handleJoin(pos, amount) {
    const { signerAddr, account } = this.props;

    const promise = promisifyWeb3Call(this.token.transData.sendTransaction)(
      this.tableAddr,
      amount,
      `0x0${(pos).toString(16)}${signerAddr.replace('0x', '')}`,
    );

    const reserve = async () => {
      const txHash = await promise;
      this.props.reserveSeat(
        this.tableAddr,
        pos,
        this.props.signerAddr,
        txHash,
        amount.toString(),
      );
    };

    if (!account.isLocked) {
      await reserve();
    }

    this.props.modalDismiss();
    this.props.setPending(
      this.tableAddr,
      this.props.latestHand,
      pos,
      { signerAddr: this.props.signerAddr, stackSize: amount }
    );

    if (account.isLocked) {
      const signerChannel = this.pusher.subscribe(signerAddr);
      signerChannel.bind('update', this.handleUpdate);
      await reserve();
    }
  }

  estimateJoin(pos, amount) {
    const { signerAddr } = this.props;
    return this.token.transData.estimateGas(
      this.tableAddr,
      amount,
      `0x0${(pos).toString(16)}${signerAddr.replace('0x', '')}`,
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
      this.props.modalAdd({
        modalType: JOIN_DIALOG,
        modalProps: {
          onJoin: (amount) => this.handleJoin(pos, amount),
          estimate: (amount) => this.estimateJoin(pos, amount),
          modalDismiss: this.props.modalDismiss,
          params: this.props.params,
          balance,
        },
        backdrop: true,
      });
    } else if (open && this.props.myPos !== undefined && !pending) {
      this.props.modalAdd({ modalType: INVITE_DIALOG });
    }
  }

  handleOpponentCall() {
    this.props.modalAdd({
      modalType: CONFIRM_DIALOG,
      modalProps: {
        msg: <FormattedMessage {...messages.opponentCallSent} />,
        onSubmit: this.props.modalDismiss,
        buttonText: <FormattedMessage {...messages.ok} />,
      },
    });
    this.tableService.callOpponent();
  }

  handleSitout() {
    // Note: sitout value possibilities
    //    sitout > 0, for enabled "play"
    //    sitout === 0, for disabled "play"
    //    sitout === undefined, for enabled "pause"
    //    sitout === null, for disabled "pause"
    // And we are only able to toggle sitout when it's enabled.
    const { sitout, sitoutAmount } = this.props;

    if (sitout !== undefined && sitout <= 0) return null;
    if (sitoutAmount <= -1) return null;

    // Note: if it's enabled "play" (> 0), then set it to disabled "pause" (null)
    // otherwise it's enabled "pause", then set it to disabled "play" (0)
    const handId = this.props.latestHand;

    const sitoutAction = bet(
      this.props.params.tableAddr,
      handId,
      sitoutAmount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt,
    );
    return sitOutToggle(sitoutAction, this.props.dispatch);
  }

  async handleLeave(pos) {
    const lineup = (this.props.lineup) ? this.props.lineup.toJS() : null;
    const handId = this.props.latestHand;
    const state = this.props.state;
    const exitHand = (state !== 'waiting') ? handId : handId - 1;

    if (!lineup) {
      return Promise.reject('Lineup is empty');
    }

    this.props.setExitHand(this.tableAddr, this.props.latestHand, pos, exitHand);
    storageService.removeItem(`rebuyModal[${this.tableAddr + handId}]`);
    this.props.modalDismiss();
    this.props.modalAdd({
      modalType: CONFIRM_DIALOG,
      modalProps: {
        msg: <FormattedMessage {...messages.leaveInProgress} />,
        onSubmit: this.props.modalDismiss,
        buttonText: <FormattedMessage {...messages.ok} />,
      },
    });

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
        this.props.modalAdd({
          modalType: CONFIRM_DIALOG,
          modalProps: { msg, onSubmit: this.props.modalDismiss, buttonText: 'OK!' },
        });
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

    return lineup.map((seat, i) => (
      <Seat
        key={i}
        pos={i}
        sitout={seat.sitout}
        signerAddr={seat.address}
        params={this.props.params}
        changed={changed}
        isTaken={this.isTaken}
      />
    ));
  }

  renderBoard() {
    const cards = this.props.board;
    const cardSize = 50;

    if (Array.isArray(cards)) {
      return cards.map((card, i) => (
        <BoardCardWrapper key={i}>
          <Card cardNumber={card} size={cardSize} />
        </BoardCardWrapper>
      ));
    }

    return [];
  }

  renderWinners() {
    const winners = this.props.winners || [];
    return winners.map((winner, i) => (
      <div key={i}>
        {nickNameByAddress(winner.addr)} won {formatNtz(winner.amount - winner.maxBet)} NTZ {(winner.hand) ? `with ${winner.hand}` : ''}
      </div>
    ));
  }

  render() {
    if (this.state.notFound) {
      return <NotFoundPage />;
    }

    const lineup = this.props.lineup ? this.props.lineup.toJS() : null;
    const changed = this.props.hand ? this.props.hand.get('changed') : null;
    const sb = (this.props.data && this.props.data.get('smallBlind')) || 0;
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
            winners={this.renderWinners()}
            myHand={this.props.myHand}
            pending={pending}
            sitout={this.props.sitout}
            board={this.renderBoard()}
            seats={this.renderSeats(lineup, changed)}
            hand={this.props.hand}
            potSize={this.props.potSize}
            onLeave={() => this.handleLeave(this.props.myPos)}
            onSitout={this.handleSitout}
            onCallOpponent={this.handleOpponentCall}
          />
        }
      </div>
    );
  }
}

function mapDispatchToProps() {
  return {
    loadTable,
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
    reserveSeat,
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
  tableLoadingState: makeTableLoadingStateSelector(),
});

Table.propTypes = {
  state: PropTypes.string,
  board: PropTypes.array,
  hand: PropTypes.object,
  isMyTurn: PropTypes.bool,
  myHand: PropTypes.object,
  myStack: PropTypes.number,
  lineup: PropTypes.object,
  sitout: PropTypes.any,
  params: PropTypes.object,
  privKey: PropTypes.string,
  lastReceipt: PropTypes.string,
  latestHand: PropTypes.any,
  sitoutAmount: PropTypes.number,
  standingUp: PropTypes.bool,
  proxyAddr: PropTypes.string,
  signerAddr: PropTypes.string,
  web3Redux: PropTypes.any,
  data: PropTypes.any,
  myPos: PropTypes.any,
  potSize: PropTypes.number,
  modalAdd: PropTypes.func,
  setPending: PropTypes.func,
  setExitHand: PropTypes.func,
  modalDismiss: PropTypes.func,
  reserveSeat: PropTypes.func,
  winners: PropTypes.array,
  dispatch: PropTypes.func,
  lineupReceived: PropTypes.func,
  reservationReceived: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  seatReserved: PropTypes.func,
  seatsReleased: PropTypes.func,
  updateReceived: PropTypes.func,
  loadTable: PropTypes.func,
  addMessage: PropTypes.func,
  location: PropTypes.object,
  account: PropTypes.object,
  myPendingSeat: PropTypes.number,
  tableLoadingState: PropTypes.string,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
