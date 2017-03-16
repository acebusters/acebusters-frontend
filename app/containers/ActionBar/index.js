/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'grid-styled';

import * as LocalStorage from '../../services/localStorage';
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
} from '../Table/selectors';

import { setCards } from '../Table/actions';
import Button from '../../components/Button';
import Slider from '../../components/Slider';
import ActionBarComponent from '../../components/ActionBar';
import TableService from '../../services/tableService';

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.table = new TableService(props.params.tableAddr, this.props.privKey);
  }

  componentWillReceiveProps(nextProps) {
    // use this function to dispatch auto actions
    const key = `${nextProps.params.tableAddr}-${nextProps.params.handId}-${nextProps.myPos}`;
    this.cards = LocalStorage.getItem(key);
  }

  handleBet() {
    const amount = (this.state) ? parseInt(this.state.amount, 10) : this.props.stepAndMin;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.bet(handId, amount).catch((err) => {
      console.log(err);
    }).then((data) => {
      this.props.setCards(this.props.params.tableAddr, handId, data.cards);
    });
  }

  handleCheck() {
    const amount = this.props.myMaxBet;
    const state = this.props.state;
    const handId = parseInt(this.props.params.handId, 10);
    let call;
    switch (state) {
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
    });
  }

  handleShow() {
    const amount = this.props.myMaxBet;
    const cards = this.props.me.cards;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.show(handId, amount, cards).catch((err) => {
      console.log(err);
    });
  }

  handleFold() {
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.fold(handId, amount).catch((err) => {
      console.log(err);
    });
  }

  updateValue(e) {
    const amount = (e.target.value > this.props.stackSize) ? this.props.stackSize : e.target.value;
    this.setState({ amount });
  }

  render() {
    const state = this.props.state;
    if (this.props.isMyTurn && state !== 'dealing' && state !== 'waiting') {
      return (
        <ActionBarComponent>
          <Grid xs={1 / 2}>{this.props.stepAndMin}</Grid>
          <Grid xs={1 / 2}>{(this.state) ? this.state.amount : this.props.stepAndMin}</Grid>
          <Grid xs={1 / 1}>
            <Slider
              max={this.props.max}
              min={this.props.stepAndMin}
              step={this.props.stepAndMin}
              onChange={(e) => this.updateValue(e)}
            >
            </Slider>
          </Grid>
          <Grid xs={1 / 3}>
            <Button size="large" onClick={this.handleBet} >Bet</Button>
          </Grid>
          <Grid xs={1 / 3}>
            <Button size="large" onClick={this.handleCheck} >Check</Button>
          </Grid>
          <Grid xs={1 / 3}>
            <Button size="large" onClick={this.handleFold} >Fold</Button>
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
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  stackSize: makeMyStackSelector(),
  myPos: makeMyPosSelector(),
  isMyTurn: makeIsMyTurnSelector(),
  stepAndMin: makeMinSelector(),
  max: makeMaxSelector(),
  state: makeHandStateSelector(),
});

ActionBar.propTypes = {
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  stepAndMin: React.PropTypes.number,
  max: React.PropTypes.number,
  isMyTurn: React.PropTypes.bool,
  state: React.PropTypes.string,
  stackSize: React.PropTypes.number,
  me: React.PropTypes.object,
  setCards: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
