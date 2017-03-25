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
  makePotSizeSelector,
  makeMyMaxBetSelector,
  makeAmountSelector,
  makeMyStackSelector,
  makeMyPosSelector,
  makeMinSelector,
  makeMaxSelector,
  makeIsMyTurnSelector,
  makeAmountToCallSelector,
} from '../Table/selectors';

import { setCards } from '../Table/actions';
import { ActionBarComponent, ActionButton, ActionButtonWrapper } from '../../components/ActionBar';
import TableService from '../../services/tableService';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
      amount: this.props.stepAndMin,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isMyTurn) {
      this.setActive(true);
    } else {
      this.setActive(false);
    }
  }

  setActive(active) {
    this.setState({ active });
  }

  updateAmount(value) {
    const amount = (value > this.props.stackSize) ? parseInt(this.props.stackSize + this.props.myMaxBet, 10) : parseInt(value, 10);
    this.setState({ amount });
  }

  handleBet() {
    this.setActive(false);
    const amount = (this.state) ? this.state.amount + this.props.myMaxBet : parseInt(this.props.stepAndMin, 10);
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
    let active;
    if (this.state) {
      active = this.state.active;
    }

    const amount = (this.state && this.state.amount && this.state.amount > this.props.amountToCall) ? this.state.amount : this.props.stepAndMin;
    return (
      <ActionBarComponent>
        <SliderWrapper>
          <Slider
            data-orientation="vertical"
            value={amount}
            min={this.props.stepAndMin}
            max={this.props.max}
            step={this.props.stepAndMin}
            onChange={this.updateAmount}
          >
          </Slider>
        </SliderWrapper>
        <Grid xs={1 / 3}>
          <ActionButtonWrapper>
            <ActionButton onClick={this.handleBet} disabled={!active} >
              { (this.props.amountToCall > 0) ? 'RAISE' : 'BET' } { amount }
            </ActionButton>
          </ActionButtonWrapper>
        </Grid>
        <Grid xs={1 / 3}>
          <ActionButtonWrapper>
            { this.props.amountToCall > 0 &&
              <ActionButton onClick={this.handleCall} disabled={!active}>
                CALL { this.props.amountToCall }
              </ActionButton>
            }
            { this.props.amountToCall === 0 &&
              <ActionButton onClick={this.handleCheck} disabled={!active}>
                CHECK
              </ActionButton>
            }
          </ActionButtonWrapper>
        </Grid>
        <Grid xs={1 / 3}>
          <ActionButtonWrapper>
            { this.props.amountToCall > 0 &&
            <ActionButton onClick={this.handleFold} disabled={!active}>FOLD</ActionButton>
            }
          </ActionButtonWrapper>
        </Grid>
      </ActionBarComponent>
    );
  }
}

export function mapDispatchToProps() {
  return {
    setCards: (tableAddr, handId, cards) => setCards(tableAddr, handId, cards),
  };
}


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  stackSize: makeMyStackSelector(),
  myPos: makeMyPosSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  amountToCall: makeAmountToCallSelector(),
  stepAndMin: makeMinSelector(),
  max: makeMaxSelector(),
  state: makeHandStateSelector(),
});

ActionBar.propTypes = {
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  stepAndMin: React.PropTypes.number,
  max: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  state: React.PropTypes.string,
  stackSize: React.PropTypes.number,
  me: React.PropTypes.object,
  setCards: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
