/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import { makeSelectPrivKey } from '../AccountProvider/selectors';
import { makePotSizeSelector, makeMyMaxBetSelector, makeAmountSelector } from '../Table/selectors';
import { setCards } from '../Table/actions';
import { makeStackSelector } from '../Seat/selectors';
import Button from '../../components/Button';
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
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label htmlFor={input.name}>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
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
    return this.table.bet(this.props.params.handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Bet failed with error code ${err}.` });
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
      throw new SubmissionError({ _error: `Check failed with error code ${err}.` });
    });
  }

  handleShow() {
    const amount = this.props.myMaxBet;
    const cards = this.props.me.cards;
    return this.table.show(this.props.params.handId, amount, cards).catch((err) => {
      throw new SubmissionError({ _error: `Show failed with error code ${err}.` });
    });
  }

  handleFold() {
    const amount = this.props.myMaxBet;
    return this.table.fold(this.props.params.handId, amount).catch((err) => {
      throw new SubmissionError({ _error: `Fold failed with error code ${err}.` });
    });
  }

  handleLeave() {
    const exitHand = this.props.params.handId + 1;
    return this.table.leave(exitHand).catch((err) => {
      throw new SubmissionError({ _error: `Leave failed with error code ${err}.` });
    });
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <ActionBarComponent>
        <input
          type="range"
          min="50000" // small blind amount
          step="50000" // small blind amount
          max={this.props.stackSize}
          // TODO: use redux form here
          // onChange={(e) => this.props.updateAmount(e)}
        />
        <Field name="amount" type="number" component={renderField} label="Amount" />
        {error && <strong>{error}</strong>}
        <Button onClick={handleSubmit(this.handleBet)} disabled={submitting} >Bet</Button>
        <Button onClick={handleSubmit(this.handleCheck)} disabled={submitting} >Check</Button>
        <Button onClick={handleSubmit(this.handleShow)} disabled={submitting} >Show</Button>
        <Button onClick={handleSubmit(this.handleFold)} disabled={submitting} >Fold</Button>
        <Button onClick={handleSubmit(this.handleLeave)} disabled={submitting} >Leave</Button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'actionBar', validate, warn })(ActionBar));
