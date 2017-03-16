/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import Grid from 'grid-styled';

import * as LocalStorage from '../../services/localStorage';
import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makeHandStateSelector, makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector, makeStackSelector, makeMyPosSelector } from '../Table/selectors';
import { setCards } from '../Table/actions';
import Button from '../../components/Button';
import Slider from '../../components/Slider';
import ActionBarComponent from '../../components/ActionBar';
import TableService from '../../services/tableService';


const validate = (values) => {
  const errors = {};
  if (!values.get('amount')) {
    errors.amount = 'Required';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

/* eslint-disable react/prop-types */
const renderField = ({ input, label, min, max, step }) => (
  <Grid md={4 / 4}>
    <Slider {...input} placeholder={label} min={min} max={max} step={step} />
  </Grid>
);

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
    const key = `${this.props.params.tableAddr}-${this.props.params.handId}-${this.props.myPos}`;
    this.cards = LocalStorage.getItem(key);
    if (nextProps.hand.state === 'showdown') {
      const hand = nextProps.hand;
      this.props.performShow(this.table, hand.handId, this.props.myMaxBet, this.cards);
    }
  }

  handleBet(values, dispatch) {
    const amount = parseInt(values.get('amount'), 10);
    console.log(amount);
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.bet(handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Bet failed with error ${err}.` });
    }).then((data) => {
      dispatch(setCards(this.props.params.tableAddr, handId, data.cards));
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
      throw new SubmissionError({ _error: `Check failed with error ${err}.` });
    });
  }

  handleShow() {
    const amount = this.props.myMaxBet;
    const cards = this.props.me.cards;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.show(handId, amount, cards).catch((err) => {
      throw new SubmissionError({ _error: `Show failed with error ${err}.` });
    });
  }

  handleFold() {
    const amount = this.props.myMaxBet;
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.fold(handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Fold failed with error ${err}.` });
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <ActionBarComponent>
        <Grid xs={1 / 2}>{this.props.amount}</Grid>
        <Grid xs={1 / 2}>{this.props.stackSize}</Grid>
        <Field
          name="amount"
          type="range"
          min={this.props.sb * 2}
          max={this.props.stackSize}
          step={this.props.sb * 2}
          component={renderField}
          label="Amount"
        />
        <Grid xs={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleBet)} disabled={submitting} >Bet</Button>
        </Grid>
        <Grid xs={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleCheck)} disabled={submitting} >Check</Button>
        </Grid>
        <Grid xs={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleFold)} disabled={submitting} >Fold</Button>
        </Grid>
      </ActionBarComponent>
    );
  }
}

export function mapDispatchToProps() {
  return {};
}


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  stackSize: makeStackSelector(),
  myPos: makeMyPosSelector(),
  state: makeHandStateSelector(),
});

ActionBar.propTypes = {
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  myPos: React.PropTypes.number,
  me: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'actionBar', validate, warn })(ActionBar));
