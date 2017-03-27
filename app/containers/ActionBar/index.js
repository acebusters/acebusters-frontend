/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'grid-styled';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import SliderWrapper from '../../components/Slider';

import { makeSelectPrivKey } from '../AccountProvider/selectors';
import {
  makeHandStateSelector,
  makeMyMaxBetSelector,
  makeMinSelector,
  makeMaxSelector,
  makeIsMyTurnSelector,
  makeAmountToCallSelector,
} from '../Table/selectors';

import { setCards } from '../Table/actions';
import { ActionBarComponent, ActionButton, ActionButtonWrapper } from '../../components/ActionBar';
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
    const amount = this.props.stepAndMin;
    this.state = {
      amount,
      active: true,
    };
  }

  setActive(active) {
    this.setState({ active });
  }

  updateAmount(value) {
    const amount = parseInt(value + this.props.myMaxBet, 10);
    this.setState({ amount });
  }

  handleBet() {
    this.setActive(false);
    const amount = this.state.amount + this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.bet(handId, amount).catch((err) => {
      console.log(err);
      this.setActive(true);
    }).then((data) => {
      this.props.setCards(this.props.params.tableAddr, handId, data.cards);
    });
  }

  handleCall() {
    const amount = parseInt(this.props.amountToCall, 10);
    this.setState({ amount }, function () {
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
      console.log(err);
      this.setActive(true);
    });
  }

  handleShow() {
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const cards = this.props.me.cards;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.show(handId, amount, cards).catch((err) => {
      console.log(err);
    });
  }

  handleFold() {
    this.setActive(false);
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.fold(handId, amount).catch((err) => {
      console.log(err);
      this.setActive(true);
    });
  }

  render() {
    if (this.state.active
        && this.props.isMyTurn
        && this.props.state !== 'waiting'
        && this.props.state !== 'dealing') {
      return (
        <ActionBarComponent>
          <SliderWrapper>
            <Slider
              key="betting-slider"
              data-orientation="vertical"
              value={this.state.amount}
              min={this.props.stepAndMin}
              max={this.props.max}
              step={this.props.stepAndMin}
              onChange={this.updateAmount}
            >
            </Slider>
          </SliderWrapper>
          <Grid xs={1 / 3}>
            <ActionButtonWrapper>
              <ActionButton onClick={this.handleBet} text={`BET ${this.state.amount}`}>
              </ActionButton>
              <Grid xs={1 / 3}>
                <ActionButtonWrapper>
                  { this.props.amountToCall > 0 &&
                  <ActionButton onClick={this.handleCall} text={`CALL ${this.props.amountToCall}`}>
                  </ActionButton>
                  }
                  { this.props.amountToCall === 0 &&
                  <ActionButton onClick={this.handleCheck} text="CHECK">
                  </ActionButton>
                  }
                </ActionButtonWrapper>
              </Grid>
              <Grid xs={1 / 3}>
                <ActionButtonWrapper>
                  { this.props.amountToCall > 0 &&
                    <ActionButton onClick={this.handleFold} text="FOLD"></ActionButton>
                  }
                </ActionButtonWrapper>
              </Grid>
            </ActionButtonWrapper>
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
  stepAndMin: makeMinSelector(),
  max: makeMaxSelector(),
  state: makeHandStateSelector(),
});

ActionBar.propTypes = {
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  myMaxBet: React.PropTypes.number,
  isMyTurn: React.PropTypes.bool,
  stepAndMin: React.PropTypes.number,
  max: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  state: React.PropTypes.string,
  me: React.PropTypes.object,
  setCards: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
