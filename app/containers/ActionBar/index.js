/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { playIsPlayerTurn } from '../../sounds';

import {
  setActionBarTurnComplete,
  setActionBarMode,
  setActionBarBetSlider,
  setActionBarButtonActive,
} from './actions';

import {
  getActionBarSliderOpen,
  getActionBarMode,
  getActionBarTurnComplete,
  getActionBarButtonActive,
  makeSelectActionBarActive,
  makeSelectActionBarVisible,
  makeMinSelector,
  makeCallAmountSelector,
  makeAmountToCallSelector,
} from './selectors';

import { makeSelectPrivKey } from '../AccountProvider/selectors';

import {
  makeIsMyTurnSelector,
  makeMyMaxBetSelector,
  makeMessagesSelector,
  makePlayersCountSelector,
} from '../Table/selectors';

import {
  makeMyCardsSelector,
  makeMyStackSelector,
} from '../Seat/selectors';

import { setCards, bet, pay, fold, check } from '../Table/actions';

import ActionBar from '../../components/ActionBar';

class ActionBarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleAllIn = this.handleAllIn.bind(this);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.state = {
      amount: 0,
      disabled: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.turnComplete === true) {
      this.props.setActionBarTurnComplete(false);
      this.props.setActionBarMode('');
    }
    if (nextProps.minRaise && nextProps.minRaise !== this.props.minRaise) {
      this.updateAmount(nextProps.minRaise);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const wasDisabled = !prevProps.active || prevState.disabled;
    const disabled = !this.props.active || this.state.disabled;
    // should play sound
    if (wasDisabled && !disabled) {
      playIsPlayerTurn();
    }
  }

  // call this after each player action
  disableTemporarilyAfterAction() {
    this.setState({ disabled: true });
    setTimeout(() => {
      this.setState({ disabled: false });
    }, 3000);
  }

  updateAmount(value) {
    let amount = parseInt(value, 10);
    amount = (amount > this.props.myStack) ? this.props.myStack : amount;
    this.setState({ amount });
  }

  captureError(handId) {
    const self = this;

    return (err) => {
      Raven.captureException(err, { tags: {
        tableAddr: self.props.params.tableAddr,
        handId,
      } });
      this.props.setActionBarTurnComplete(true);
      this.props.setActionBarMode('');
    };
  }

  handleAllIn() {
    // if player wants to raise and their stack is smaller than the minRaise amount, then bet their stack
    const { minRaise, myStack } = this.props;
    const amount = (myStack < minRaise) ? myStack : minRaise;
    this.setState({ amount }, () => this.handleBet());
  }

  handleBet() {
    this.props.setActionBarTurnComplete(true);
    this.disableTemporarilyAfterAction();
    const amount = this.state.amount + this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);

    const betAction = this.props.bet(this.props.params.tableAddr, handId, amount, this.props.privKey, this.props.myPos, this.props.lastReceipt);
    return this.props.pay(betAction, this.props.dispatch)
    .then((cards) => {
      this.props.setCards(this.props.params.tableAddr, handId, cards);
    })
    .catch(this.captureError(handId));
  }

  handleCall() {
    const amount = parseInt(this.props.callAmount, 10);
    this.setState({ amount }, () => {
      this.handleBet();
    });
  }

  handleCheck() {
    this.props.setActionBarTurnComplete(true);
    this.disableTemporarilyAfterAction();
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    const checkStates = ['preflop', 'turn', 'river', 'flop'];
    const state = this.props.state;
    const checkType = checkStates.indexOf(state) !== -1 ? state : 'flop';
    const action = this.props.check(
      this.props.params.tableAddr,
      handId,
      amount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt,
      checkType,
    );

    return this.props.pay(action, this.props.dispatch)
      .then((cards) => {
        this.props.setCards(this.props.params.tableAddr, handId, cards);
      })
      .catch(this.captureError(handId));
  }

  handleFold() {
    this.props.setActionBarTurnComplete(true);
    this.disableTemporarilyAfterAction();
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    const action = this.props.fold(
      this.props.params.tableAddr,
      handId,
      amount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt
    );

    return this.props.pay(action, this.props.dispatch)
      .then((cards) => {
        this.props.setCards(this.props.params.tableAddr, handId, cards);
      })
      .catch(this.captureError(handId));
  }

  render() {
    return (
      <ActionBar
        amount={this.state.amount}
        disabled={this.state.disabled}
        handleAllIn={this.handleAllIn}
        handleBet={this.handleBet}
        handleCheck={this.handleCheck}
        handleCall={this.handleCall}
        handleFold={this.handleFold}
        updateAmount={this.updateAmount}
        {...this.props}
      />
    );
  }
}

ActionBarContainer.propTypes = {
  active: PropTypes.bool,
  bet: PropTypes.func,
  callAmount: PropTypes.number,
  check: PropTypes.func,
  dispatch: PropTypes.func,
  fold: PropTypes.func,
  lastReceipt: PropTypes.object,
  minRaise: PropTypes.number,
  myMaxBet: PropTypes.number,
  myPos: PropTypes.number,
  myStack: PropTypes.number,
  pay: PropTypes.func,
  params: PropTypes.object,
  privKey: PropTypes.string,
  setCards: PropTypes.func,
  state: PropTypes.string,
  setActionBarTurnComplete: PropTypes.func,
  setActionBarMode: PropTypes.func,
  turnComplete: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setCards: (tableAddr, handId, cards) => setCards(tableAddr, handId, cards),
    bet: (tableAddr, handId, amount, privKey, myPos, lastReceipt) => bet(
      tableAddr, handId, amount, privKey, myPos, lastReceipt,
    ),
    pay: (betAction) => pay(betAction, dispatch),
    fold: (tableAddr, handId, amount, privKey, myPos, lastReceipt) => fold(
      tableAddr, handId, amount, privKey, myPos, lastReceipt),
    check: (tableAddr, handId, amount, privKey, myPos, lastReceipt, checkType
      ) => check(
        tableAddr, handId, amount, privKey, myPos, lastReceipt, checkType
    ),
    setActionBarTurnComplete: (complete) => dispatch(setActionBarTurnComplete(complete)),
    setActionBarBetSlider: (open) => dispatch(setActionBarBetSlider(open)),
    setActionBarMode: (mode) => dispatch(setActionBarMode(mode)),
    setActionBarButtonActive: (whichBtn) => dispatch(setActionBarButtonActive(whichBtn)),
  };
}

const mapStateToProps = createStructuredSelector({
  active: makeSelectActionBarActive(),
  amountToCall: makeAmountToCallSelector(),
  callAmount: makeCallAmountSelector(),
  cards: makeMyCardsSelector(),
  buttonActive: getActionBarButtonActive(),
  isMyTurn: makeIsMyTurnSelector(),
  playerCount: makePlayersCountSelector(),
  privKey: makeSelectPrivKey(),
  messages: makeMessagesSelector(),
  mode: getActionBarMode(),
  minRaise: makeMinSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  myStack: makeMyStackSelector(),
  sliderOpen: getActionBarSliderOpen(),
  turnComplete: getActionBarTurnComplete(),
  visible: makeSelectActionBarVisible(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionBarContainer);
