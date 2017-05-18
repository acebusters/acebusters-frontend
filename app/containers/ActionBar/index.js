/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'grid-styled';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Raven from 'raven-js';

import SliderWrapper from '../../components/Slider';
import ChatWrapper from '../../components/Chat';
import Chat from '../../containers/Chat';

import {
  makeMinSelector,
  makeCallAmountSelector,
  makeAmountToCallSelector,
} from './selectors';

import { makeSelectPrivKey } from '../AccountProvider/selectors';

import {
  makeHandStateSelector,
  makeMyMaxBetSelector,
  makeIsMyTurnSelector,
  makeMyPosSelector,
  makeMessagesSelector,
} from '../Table/selectors';

import {
  makeMyCardsSelector,
  makeMyStackSelector,
  makeLastReceiptSelector,
} from '../Seat/selectors';

import { bet, pay, fold, check, setCards, sendMessage } from '../Table/actions';
import { ActionBarComponent, ActionButton } from '../../components/ActionBar';
import TableService from '../../services/tableService';

export class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.table = new TableService(props.params.tableAddr, this.props.privKey);
    this.state = {
      active: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const min = nextProps.minRaise;
    const amount = (min && nextProps.myStack < min) ? nextProps.myStack : min;
    this.setState({ amount });
    if (nextProps.isMyTurn === true) {
      this.setActive(true);
    }
  }

  setActive(active) {
    this.setState({ active });
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
      self.setActive(true);
    };
  }

  handleBet() {
    this.setActive(false);
    const amount = this.state.amount + this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);

    const betAction = bet(this.props.params.tableAddr, handId, amount, this.props.privKey, this.props.myPos, this.props.lastReceipt);
    return pay(betAction, this.props.dispatch)
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
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    const checkStates = ['preflop', 'turn', 'river', 'flop'];
    const state = this.props.state;
    const checkType = checkStates.indexOf(state) !== -1 ? state : 'flop';
    const action = check(
      this.props.params.tableAddr,
      handId,
      amount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt,
      checkType,
    );

    return pay(action, this.props.dispatch)
      .then((cards) => {
        this.props.setCards(this.props.params.tableAddr, handId, cards);
      })
      .catch(this.captureError(handId));
  }

  handleFold() {
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    const action = fold(
      this.props.params.tableAddr,
      handId,
      amount,
      this.props.privKey,
      this.props.myPos,
      this.props.lastReceipt
    );

    return pay(action, this.props.dispatch)
      .then((cards) => {
        this.props.setCards(this.props.params.tableAddr, handId, cards);
      })
      .catch(this.captureError(handId));
  }

  sendMessage(message) {
    this.props.sendMessage(message, this.props.params.tableAddr, this.props.privKey);
  }

  render() {
    if (this.state.active
        && this.props.isMyTurn
        && this.props.state !== 'waiting'
        && this.props.state !== 'dealing'
        && this.props.state !== 'showdown') {
      const raiseButton = (this.props.myStack > this.props.amountToCall) ? (<ActionButton size="medium" onClick={this.handleBet} text={`RAISE ${this.state.amount}`} />) : null;
      return (
        <ActionBarComponent>
          <SliderWrapper>
            { this.props.myStack > this.props.amountToCall &&
              <Slider
                key="betting-slider"
                data-orientation="vertical"
                value={this.state.amount}
                min={this.props.minRaise}
                max={this.props.myStack}
                step={1}
                onChange={this.updateAmount}
              >
              </Slider>
            }
          </SliderWrapper>
          <Grid xs={1 / 3}>
            { this.props.amountToCall > 0 &&
              <div>
                { raiseButton }
                <ActionButton size="medium" onClick={this.handleCall} text={`CALL ${this.props.callAmount}`}>
                </ActionButton>
                <ActionButton size="medium" onClick={this.handleFold} text="FOLD"></ActionButton>
              </div>
            }
            { this.props.amountToCall === 0 &&
              <div>
                <ActionButton size="medium" onClick={this.handleBet} text={`BET ${this.state.amount}`}>
                </ActionButton>
                <ActionButton size="medium" onClick={this.handleCheck} text="CHECK">
                </ActionButton>
              </div>
            }
          </Grid>
        </ActionBarComponent>
      );
    } else if (!this.props.isMyTurn
               && this.props.state !== 'waiting'
               && this.props.state !== 'dealing'
               && this.props.state !== 'showdown') {
      return (
        <ChatWrapper>
          <Chat onAddMessage={this.sendMessage} messages={this.props.messages} />
        </ChatWrapper>
      );
    }
    return null;
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setCards: (tableAddr, handId, cards) => setCards(tableAddr, handId, cards),
    sendMessage: (message, tableAddr, privKey) => dispatch(sendMessage(message, tableAddr, privKey)),
  };
}


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  myMaxBet: makeMyMaxBetSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  amountToCall: makeAmountToCallSelector(),
  callAmount: makeCallAmountSelector(),
  minRaise: makeMinSelector(),
  myStack: makeMyStackSelector(),
  myPos: makeMyPosSelector(),
  lastReceipt: makeLastReceiptSelector(),
  cards: makeMyCardsSelector(),
  state: makeHandStateSelector(),
  messages: makeMessagesSelector(),
});

ActionBar.propTypes = {
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  lastReceipt: React.PropTypes.string,
  myPos: React.PropTypes.number,
  myMaxBet: React.PropTypes.number,
  isMyTurn: React.PropTypes.bool,
  minRaise: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  myStack: React.PropTypes.number,
  callAmount: React.PropTypes.number,
  state: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  setCards: React.PropTypes.func,
  sendMessage: React.PropTypes.func,
  messages: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
