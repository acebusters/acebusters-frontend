/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import Grid from 'grid-styled';

import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector } from '../Table/selectors';
import { setCards } from '../Table/actions';
import { makeStackSelector } from '../Seat/selectors';
import Button from '../../components/Button';
import Slider from '../../components/Slider';
import Input from '../../components/Input';
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
const renderField = ({ input, label, type, min, max, step }) => (
  <div>
    <Grid sm={1 / 4}>
      <Input type="number" />
    </Grid>
    <Grid sm={3 / 4}>
      <Slider {...input} placeholder={label} type={type} min={min} max={max} step={step} />
    </Grid>
  </div>

);

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.handleLeave = this.handleLeave.bind(this);

    this.table = new TableService(props.params.tableAddr, this.props.privKey);
  }

  handleBet(values, dispatch) {
    const amount = parseInt(values.get('amount'), 10);
    const handId = parseInt(this.props.params.handId, 10);
    return this.table.bet(handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Bet failed with error ${err}.` });
    }).then((data) => {
      console.dir(data);
      dispatch(setCards(this.props.params.tableAddr, this.props.params.handId, data.cards));
    });
  }

  handleCheck() {
    const amount = this.props.myMaxBet;
    const state = 'something';
    let call;
    switch (state) {
      case 'turn': {
        call = this.table.checkTurn(this.props.params.handId, amount);
        break;
      }
      case 'river': {
        call = this.table.checkRiver(this.props.params.handId, amount);
        break;
      }
      default: {
        call = this.table.checkFlop(this.props.params.handId, amount);
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

  handleLeave() {
    const handId = parseInt(this.props.params.handId, 10);
    const exitHand = handId - 1;
    return this.table.leave(exitHand).catch((err) => {
      throw new SubmissionError({ _error: `Leave failed with error ${err}.` });
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <ActionBarComponent>
        <Field
          name="amount"
          type="range"
          component={renderField}
          label="Amount"
          max={this.props.stackSize}
          min={this.props.sb}
          step={this.props.sb}
        />
        <Grid sm={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleBet)} disabled={submitting} >Bet</Button>
        </Grid>
        <Grid sm={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleCheck)} disabled={submitting} >Check</Button>
        </Grid>
        <Grid sm={1 / 3}>
          <Button size="large" onClick={handleSubmit(this.handleFold)} disabled={submitting} >Fold</Button>
        </Grid>
      </ActionBarComponent>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return { dispatch };
}


const mapStateToProps = createStructuredSelector({
  privKey: makeSelectPrivKey(),
  amount: makeAmountSelector(),
  potSize: makePotSizeSelector(),
  myMaxBet: makeMyMaxBetSelector(),
  stackSize: makeStackSelector(),
});

ActionBar.propTypes = {
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  me: React.PropTypes.object,
  stackSize: React.PropTypes.number,
  sb: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'actionBar', validate, warn })(ActionBar));
