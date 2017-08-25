/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { TIMEOUT_PERIOD } from '../../app.config';

import { playIsPlayerTurn } from '../../sounds';

import {
  handleClickButton,
  setActionBarTurnComplete,
  setActionBarButtonActive,
  updateActionBar,
  ALL_IN,
  BET,
  CHECK,
  CALL,
  FOLD,
} from './actions';

import {
  getExecuteAction,
  getActionBarSliderOpen,
  getActionBarMode,
  getActionBarTurnComplete,
  getActionBarButtonActive,
  makeSelectActionBarActive,
  makeSelectActionBarVisible,
  makeMinSelector,
  makeCallAmountSelector,
  makeAmountToCallSelector,
  makeCanICheckSelector,
} from './selectors';

import { makeSelectPrivKey } from '../AccountProvider/selectors';

import {
  makeIsMyTurnSelector,
  makeMyMaxBetSelector,
  makeMessagesSelector,
  makePlayersCountSelector,
  makeLatestHandSelector,
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
      amount: this.props.minRaise,
      disabled: false,
    };
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line consistent-return
    const handId = this.props.latestHand;
    const { isMyTurn, canICheck } = nextProps;
    // # if player <in turn> can <check>: send <check> by timeout
    if (isMyTurn && canICheck) {
      if (this.checkTimeOut) {
        clearTimeout(this.checkTimeOut);
        this.checkTimeOut = null;
      }

      let passed = Math.floor(Date.now() / 1000) - nextProps.hand.get('changed');
      passed = (passed > TIMEOUT_PERIOD) ? TIMEOUT_PERIOD : passed;
      // autoCheckTimeOut should be earlier than usual timeout, so -1.5 sec
      const autoCheckTimeOut = ((TIMEOUT_PERIOD * 1000) - (passed * 1000)) - 1500;

      if (autoCheckTimeOut > 0) {
        this.checkTimeOut = setTimeout(() => this.handleCheck(nextProps), autoCheckTimeOut);
      }
    }

    if (nextProps.turnComplete === true) {
      this.props.setActionBarTurnComplete(false);
    }
    if (nextProps.minRaise && nextProps.minRaise !== this.props.minRaise) {
      this.updateAmount(nextProps.minRaise);
    }
    const { executeAction, mode } = nextProps;
    // after handleClickButton saga updates state to execute action
    if (executeAction) {
      this.disableTemporarilyAfterAction();
      this.resetActionBar();
      switch (mode) {
        case ALL_IN:
          return this.handleAllIn();
        case BET:
          return this.handleBet();
        case CHECK:
          return this.handleCheck(this.props);
        case CALL:
          return this.handleCall();
        case FOLD:
          return this.handleFold();
        default:
          return this.captureError(handId);
      }
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

  componentWillUnmount() {
    if (this.checkTimeOut) {
      clearTimeout(this.checkTimeOut);
      this.checkTimeOut = null;
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

  resetActionBar() {
    this.setState({ amount: this.props.minRaise });
    this.props.updateActionBar({
      executeAction: false,
      mode: '',
      buttonActive: '',
      turnComplete: true,
    });
  }

  captureError(handId) {
    const self = this;

    return (err) => {
      Raven.captureException(err, { tags: {
        tableAddr: self.props.params.tableAddr,
        handId,
      } });
      this.resetActionBar();
    };
  }

  handleAllIn() {
    // if player wants to raise and their stack is smaller than the minRaise amount, then bet their stack
    const { minRaise, myStack } = this.props;
    const amount = (myStack < minRaise) ? myStack : minRaise;
    this.setState({ amount }, () => this.handleBet());
  }

  handleBet() {
    const handId = this.props.latestHand;
    const amount = this.state.amount + this.props.myMaxBet;
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

  handleCheck(props) {
    const amount = props.myMaxBet;
    const handId = props.latestHand;
    const checkStates = ['preflop', 'turn', 'river', 'flop'];
    const state = props.state;
    const checkType = checkStates.indexOf(state) !== -1 ? state : 'flop';
    const action = props.check(
      props.params.tableAddr,
      handId,
      amount,
      props.privKey,
      props.myPos,
      props.lastReceipt,
      checkType,
    );

    return props.pay(action, props.dispatch)
      .then((cards) => {
        props.setCards(props.params.tableAddr, handId, cards);
      })
      .catch(this.captureError(handId));
  }

  handleFold() {
    const amount = this.props.myMaxBet;
    const handId = this.props.latestHand;
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
  dispatch: PropTypes.func,
  fold: PropTypes.func,
  lastReceipt: PropTypes.object,
  minRaise: PropTypes.number,
  latestHand: PropTypes.number,
  myMaxBet: PropTypes.number,
  myPos: PropTypes.number,
  myStack: PropTypes.number,
  pay: PropTypes.func,
  params: PropTypes.object,
  privKey: PropTypes.string,
  setCards: PropTypes.func,
  setActionBarTurnComplete: PropTypes.func,
  turnComplete: PropTypes.bool,
  executeAction: PropTypes.bool,
  mode: PropTypes.string,
  updateActionBar: PropTypes.func,
  canICheck: PropTypes.bool,
  isMyTurn: React.PropTypes.bool,
  hand: React.PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setCards,
    bet,
    pay: (betAction) => pay(betAction, dispatch),
    fold,
    check,
    handleClickButton: (type) => dispatch(handleClickButton(type)),
    setActionBarTurnComplete: (complete) => dispatch(setActionBarTurnComplete(complete)),
    setActionBarButtonActive: (btn) => dispatch(setActionBarButtonActive(btn)),
    updateActionBar: (payload) => dispatch(updateActionBar(payload)),
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
  executeAction: getExecuteAction(),
  latestHand: makeLatestHandSelector(),
  canICheck: makeCanICheckSelector(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionBarContainer);
