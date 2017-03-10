/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import Grid from 'grid-styled';

import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector, makeMyStackSelector } from '../Table/selectors';
import { setCards } from '../Table/actions';
import Button from '../../components/Button';
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
const renderField = ({ input, label, type }) => (
  <Grid md={4 / 4}>
    <Input {...input} placeholder={label} type={type} />
  </Grid>
);

class ActionBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleBet = this.handleBet.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleFold = this.handleFold.bind(this);
    this.handId = parseInt(props.params.handId, 10);
    this.table = new TableService(props.params.tableAddr, this.props.privKey);
  }

  handleBet(values, dispatch) {
    const amount = parseInt(values.get('amount'), 10);
    return this.table.bet(this.handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Bet failed with error ${err}.` });
    }).then((data) => {
      dispatch(setCards(this.props.params.tableAddr, this.handId, data.cards));
    });
  }

  handleCheck() {
    const amount = this.props.myMaxBet;
    const state = 'something';
    let call;
    switch (state) {
      case 'turn': {
        call = this.table.checkTurn(this.handId, amount);
        break;
      }
      case 'river': {
        call = this.table.checkRiver(this.handId, amount);
        break;
      }
      default: {
        call = this.table.checkFlop(this.handId, amount);
      }
    }
    return call.catch((err) => {
      throw new SubmissionError({ _error: `Check failed with error ${err}.` });
    });
  }

  handleShow() {
    const amount = this.props.myMaxBet;
    const cards = this.props.me.cards;
    return this.table.show(this.handId, amount, cards).catch((err) => {
      throw new SubmissionError({ _error: `Show failed with error ${err}.` });
    });
  }

  handleFold() {
    const amount = this.props.myMaxBet;
    return this.table.fold(this.handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Fold failed with error ${err}.` });
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <ActionBarComponent>
        <Field
          name="amount"
          type="number"
          component={renderField}
          label="Amount"
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
  stackSize: makeMyStackSelector(),
});

ActionBar.propTypes = {
  lastHandNettedOnClient: React.PropTypes.number,  // eslint-disable-line
  params: React.PropTypes.object,
  privKey: React.PropTypes.string,
  cards: React.PropTypes.array,
  myMaxBet: React.PropTypes.number,
  me: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'actionBar', validate, warn })(ActionBar));
