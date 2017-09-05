import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import { NTZ_DECIMALS, ETH_DECIMALS, formatNtz, formatEth, normalizerFloat } from '../../utils/amountFormatter';
import { round } from '../../utils';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import SubmitButton from '../SubmitButton';
import TokenAmountField from '../Form/TokenAmountField';
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
      messages,
      handleSubmit,
      submitting,
      maxAmount,
      amount = 0,
      calcExpectedAmount,
      amountUnit,
      title,
      descr,
      invalid,
      hasWeb3,
      networkSupported,
      placeholder,
    } = this.props;
    const expectedAmountUnit = amountUnit.toLowerCase() === 'ntz' ? 'eth' : 'ntz';
    const formatExpValue = expectedAmountUnit === 'ntz' ? formatNtz : formatEth;
    const decimals = expectedAmountUnit === 'ntz' ? NTZ_DECIMALS : ETH_DECIMALS;

    return (
      <div style={{ maxWidth: 480 }}>
        {title && <H2>{title}</H2>}
        {descr}

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            normalize={normalizerFloat}
            name="amount"
            component={TokenAmountField}
            label={<FormattedMessage {...messages.sellTitle} />}
            autoFocus
            maxAmount={maxAmount}
            minAmount={this.props.minAmount}
            modalAdd={this.props.modalAdd}
            modalDismiss={this.props.modalDismiss}
            amountUnit={this.props.amountUnit}
            setAmountUnit={this.props.setAmountUnit}
            reset={this.props.reset}
            placeholder={placeholder}
          />

          {calcExpectedAmount && expectedAmountUnit &&
            <FeedbackField>
              <FormattedMessage
                {...messages.expectedAmount}
                values={{
                  amount: formatExpValue(calcExpectedAmount(round(amount, 8)).mul(decimals)),
                }}
              />
              <ReceiveUnit>
                {expectedAmountUnit.toUpperCase()}
              </ReceiveUnit>
            </FeedbackField>
          }

          {!hasWeb3 && <NoWeb3Message />}
          {hasWeb3 && !networkSupported && <UnsupportedNetworkMessage />}

          <SubmitButton
            disabled={invalid || !hasWeb3 || !networkSupported}
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
  networkSupported: PropTypes.bool,
  hasWeb3: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  calcExpectedAmount: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleExchange: PropTypes.func, // eslint-disable-line
  stopSubmit: PropTypes.func,
  amount: PropTypes.string,
  title: PropTypes.node,
  descr: PropTypes.node,
  amountUnit: PropTypes.string.isRequired,
  reset: PropTypes.func,
  placeholder: PropTypes.string,
};

export default ExchangeDialog;
