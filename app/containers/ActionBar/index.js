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

import {
  makeMinSelector,
  makeMaxSelector,
  makeCallAmountSelector,
  makeAmountToCallSelector,
} from './selectors';

import { makeSelectPrivKey } from '../AccountProvider/selectors';

import {
  makeHandStateSelector,
  makeMyMaxBetSelector,
  makeIsMyTurnSelector,
  makeMyStackSelector,
} from '../Table/selectors';

import {
  makeMyCardsSelector,
} from '../Seat/selectors';

import { setCards } from '../Table/actions';
import { ActionBarComponent, ActionButton } from '../../components/ActionBar';
import TableService from '../../services/tableService';

export class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.table = new TableService(props.params.tableAddr, this.props.privKey);
    this.state = {
      active: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const min = (nextProps.amountToCall + nextProps.minRaise);
    const amount = (nextProps.myStack < min) ? nextProps.myStack : min;
    this.setState({ amount });
    if (nextProps.isMyTurn === true) {
      this.setActive(true);
    }
  }

  setActive(active) {
    this.setState({ active });
  }

  updateAmount(value) {
    const amount = parseInt(value, 10);
    this.setState({ amount });
  }

  handleBet() {
    this.setActive(false);
    const amount = this.state.amount + this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.bet(handId, amount).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
      this.setActive(true);
    }).then((data) => {
      this.props.setCards(this.props.params.tableAddr, handId, data.cards);
    });
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
    const state = this.props.state;
    const handId = parseInt(this.props.params.handId, 10);
    let call;
    switch (state) {
      case 'preflop': {
        call = this.table.checkPreflop(handId, amount);
        break;
      }
      case 'turn': {
        call = this.table.checkTurn(handId, amount);
        break;
      }
      case 'river': {
        call = this.table.checkRiver(handId, amount);
        break;
      }
      default: {
        call = this.table.checkFlop(handId, amount);
      }
    }
    return call.catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
      this.setActive(true);
    });
  }

  handleShow() {
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const cards = this.props.cards;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.show(handId, amount, cards).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
    });
  }

  handleFold() {
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.fold(handId, amount).catch((err) => {
      Raven.captureException(err, { tags: {
        tableAddr: this.props.params.tableAddr,
        handId,
      } });
      this.setActive(true);
    });
  }

  render() {
    if (this.state.active
        && this.props.isMyTurn
        && this.props.state !== 'waiting'
        && this.props.state !== 'dealing'
        && this.props.state !== 'showdown') {
      return (
        <ActionBarComponent>
          <SliderWrapper>
            { this.props.myStack > this.props.amountToCall &&
              <Slider
                key="betting-slider"
                data-orientation="vertical"
                value={this.state.amount}
                min={this.props.amountToCall + this.props.minRaise}
                max={this.props.max}
                step={10} // this should be the smallest unit of our token
                onChange={this.updateAmount}
              >
              </Slider>
            }
          </SliderWrapper>
          <Grid xs={1 / 3}>
            { this.props.amountToCall > 0 &&
              <div>
                <ActionButton onClick={this.handleBet} text={`RAISE ${this.state.amount}`}>
                </ActionButton>
                <ActionButton onClick={this.handleCall} text={`CALL ${this.props.callAmount}`}>
                </ActionButton>
                <ActionButton onClick={this.handleFold} text="FOLD"></ActionButton>
              </div>
            }
            { this.props.amountToCall === 0 &&
              <div>
                <ActionButton onClick={this.handleBet} text={`BET ${this.state.amount}`}>
                </ActionButton>
                <ActionButton onClick={this.handleCheck} text="CHECK">
                </ActionButton>
              </div>
            }
          </Grid>
        </ActionBarComponent>
      );
    }
    return null;
  }
}

export function mapDispatchToProps() {
  return {
    setCards: (tableAddr, handId, cards) => setCards(tableAddr, handId, cards),
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
  max: makeMaxSelector(),
  cards: makeMyCardsSelector(),
  state: makeHandStateSelector(),
});

ActionBar.propTypes = {
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  myMaxBet: React.PropTypes.number,
  isMyTurn: React.PropTypes.bool,
  minRaise: React.PropTypes.number,
  max: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  myStack: React.PropTypes.number,
  callAmount: React.PropTypes.number,
  state: React.PropTypes.string,
  cards: React.PropTypes.array,
  setCards: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
