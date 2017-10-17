import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import { normalizerFloat } from '../../utils/amountFormatter';
import { ABP, ETH, NTZ } from '../../containers/Dashboard/actions';

import Web3Alerts from '../../containers/Web3Alerts';
import EstimateWarning from '../../containers/EstimateWarning';
import SubmitButton from '../SubmitButton';
import H2 from '../H2';

import {
  FeedbackField,
  ReceiveUnit,
 } from './styles';

class ExchangeDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(values) {
    try {
      await this.props.handleExchange(
        values.get('amount')
      );
      this.props.reset();
    } catch (err) {
      if (err.errors) {
        setTimeout(() => this.props.stopSubmit(err.errors));
      } else {
        throw err;
      }
    }
  }

  render() {
    const {
      amountUnit,
      messages,
      handleSubmit,
      submitting,
      maxAmount,
      amount = 0,
      calcExpectedAmount,
      expectedAmountUnit,
      estimateExchange,
      title,
      descr,
      invalid,
      canSendTx,
      placeholder,
    } = this.props;
    return (
      <div
        style={{ maxWidth: 480 }}
        data-tour={`exchange-${amountUnit}-form`}
      >
        {title && <H2>{title}</H2>}
        {descr}

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            normalize={normalizerFloat}
            name="amount"
            label={this.props.label}
            autoFocus
            maxAmount={maxAmount}
            minAmount={this.props.minAmount}
            modalAdd={this.props.modalAdd}
            modalDismiss={this.props.modalDismiss}
            amountUnit={this.props.amountUnit}
            setAmountUnit={this.props.setAmountUnit}
            component={this.props.component}
            placeholder={placeholder}
          />

          {calcExpectedAmount && expectedAmountUnit &&
            <FeedbackField>
              <FormattedMessage
                {...messages.expectedAmount}
                values={{ amount: calcExpectedAmount(amount) }}
              />
              <ReceiveUnit>
                {expectedAmountUnit.toUpperCase()}
              </ReceiveUnit>
            </FeedbackField>
          }

          <Web3Alerts />

          {!invalid && canSendTx && amount &&
            <EstimateWarning
              estimate={estimateExchange}
              args={[amount]}
            />
          }

          <SubmitButton
            disabled={invalid || !canSendTx}
            submitting={submitting}
          >
            <FormattedMessage {...messages.submitButton} />
          </SubmitButton>
        </Form>
      </div>
    );
  }
}

ExchangeDialog.propTypes = {
  messages: PropTypes.object,
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
  minAmount: PropTypes.object, // BigNumber
  submitting: PropTypes.bool,
  setAmountUnit: PropTypes.func,
  invalid: PropTypes.bool,
  canSendTx: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  calcExpectedAmount: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  handleExchange: PropTypes.func, // eslint-disable-line
  estimateExchange: PropTypes.func, // eslint-disable-line
  stopSubmit: PropTypes.func,
  amount: PropTypes.string,
  title: PropTypes.node,
  descr: PropTypes.node,
  amountUnit: PropTypes.string.isRequired,
  expectedAmountUnit: PropTypes.oneOf([NTZ, ETH, ABP]),
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  label: PropTypes.node,
  placeholder: PropTypes.string,
};

export default ExchangeDialog;
