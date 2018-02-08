import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import Pusher from 'pusher-js';
import Raven from 'raven-js';
import { Receipt } from 'poker-helper';
import * as storageService from '../../services/sessionStorage';

// components and styles
import TableDebug from '../../containers/TableDebug';
import NotFoundPage from '../../containers/NotFoundPage';

import WithLoading from '../../components/WithLoading';
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
  makePrevHandSelector,
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

function isRebuyNeeded(props, nextProps) {
  const bb = nextProps.data ? nextProps.data.get('smallBlind') * 2 : 0;
  const { myStack, standingUp, sitout } = nextProps;
  const rebuyModal = storageService.getItem(`rebuyModal[${props.params.tableAddr}${nextProps.latestHand}]`);

  return !!(
    myStack !== null && (myStack <= 0 || myStack < bb) &&
    (sitout && typeof sitout === 'number') &&
    !standingUp &&
    !rebuyModal
  );
}

export class Table extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.watchTable = this.watchTable.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleLeaveRequest = this.handleLeaveRequest.bind(this);
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

    // display Rebuy modal if state === 'waiting' and user stack is no greater than 0
    if (isRebuyNeeded(this.props, nextProps)) {
      this.props.modalDismiss();
      this.props.modalAdd({
        modalType: JOIN_DIALOG,
        modalProps: {
          onJoin: this.handleRebuy,
          estimate: this.estimateRebuy,
          onLeave: () => this.handleLeave(this.props.myPos),
          params: this.props.params,
          rebuy: true,
        },
        closeHandler: () => this.handleLeave(this.props.myPos),
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
    const { signerAddr, myPos } = this.props;

    const promise = promisifyWeb3Call(this.token.transData.sendTransaction)(
      this.tableAddr,
      amount,
      `0x0${(myPos).toString(16)}${signerAddr.replace('0x', '')}`
    );

    return promise.then(() => {
      storageService.setItem(`rebuyModal[${this.tableAddr}${this.props.latestHand}]`, true);
      this.props.modalDismiss();
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
    const { signerAddr } = this.props;

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

    await reserve();

    this.props.modalDismiss();
    this.props.setPending(
      this.tableAddr,
      this.props.latestHand,
      pos,
      { signerAddr: this.props.signerAddr, stackSize: amount }
    );

    storageService.setItem(`rebuyModal[${this.tableAddr}${this.props.latestHand}]`, true);
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
    if (open && myPos === undefined && !pending) {
      this.props.modalAdd({
        modalType: JOIN_DIALOG,
        modalProps: {
          onJoin: (amount) => this.handleJoin(pos, amount),
          estimate: (amount) => this.estimateJoin(pos, amount),
          modalDismiss: this.props.modalDismiss,
          params: this.props.params,
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

  handleLeave(pos) {
    const handId = this.props.latestHand;
    const exitHand = this.props.state !== 'waiting' ? handId : handId - 1;

    this.props.setExitHand(this.tableAddr, this.props.latestHand, pos, exitHand);
    storageService.removeItem(`rebuyModal[${this.tableAddr}${handId}]`);

    this.props.modalDismiss();
    this.tableService.leave(exitHand, this.props.lineup.getIn([pos, 'address']))
      .catch((err) => {
        Raven.captureException(err, { tags: {
          tableAddr: this.props.params.tableAddr,
          handId,
        } });
      });
  }

  handleLeaveRequest(pos) {
    if (this.props.lineup) {
      if (this.props.state !== 'waiting') {
        this.props.modalAdd({
          modalType: CONFIRM_DIALOG,
          modalProps: {
            msg: <FormattedMessage {...messages.confirmLeave} />,
            onSubmit: () => this.handleLeave(pos),
            buttonText: <FormattedMessage {...messages.leave} />,
          },
        });
      } else {
        this.handleLeave(pos);
      }
    }
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
        // notify backend about change in lineup
        if (result.args && result.args.addr === this.props.proxyAddr) {
          this.tableService.lineup();
        }

        // update lineup when join successful
        this.table.getLineup.callPromise().then((lineup) => {
          this.props.lineupReceived(
            this.tableAddr,
            lineup,
            this.props.data.get('smallBlind'),
            this.props.latestHand,
            this.props.myPendingSeat,
          );
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

  render() {
    if (this.state.notFound) {
      return <NotFoundPage />;
    }
    const { data } = this.props;
    const lineup = this.props.lineup ? this.props.lineup.toJS() : null;

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
            sb={(data && data.get('smallBlind')) || 0}
            winners={this.props.winners}
            myHand={this.props.myHand}
            pending={(lineup && lineup[this.props.myPos]) ? lineup[this.props.myPos].pending : false}
            sitout={this.props.sitout}
            seats={lineup}
            board={this.props.board}
            potSize={this.props.potSize}
            onLeave={() => this.handleLeaveRequest(this.props.myPos)}
            onSitout={this.handleSitout}
            onCallOpponent={this.handleOpponentCall}
            isTaken={this.isTaken}
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
  prevHand: makePrevHandSelector(),
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
  prevHand: PropTypes.object, // eslint-disable-line
  myStack: PropTypes.number, // eslint-disable-line
  isMyTurn: PropTypes.bool,
  myHand: PropTypes.object,
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
  myPendingSeat: PropTypes.number,
  tableLoadingState: PropTypes.string,
};


export default web3Connect(mapStateToProps, mapDispatchToProps)(Table);
