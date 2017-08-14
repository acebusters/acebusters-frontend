import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import { NTZ_DECIMALS, ETH_DECIMALS, formatNtz, formatEth } from '../../utils/amountFormatter';
import { round } from '../../utils';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import SubmitButton from '../SubmitButton';
import TokenAmountField from '../Form/TokenAmountField';
import AmountField from '../AmountField';
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

  handleSubmit(values) {
    return this.props.handleExchange(
      values.get('amount')
    ).then(() => this.props.reset());
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
      invalid,
      hasWeb3,
      networkSupported,
    } = this.props;
    const expectedAmountUnit = amountUnit.toLowerCase() === 'ntz' ? 'eth' : 'ntz';
    const formatExpValue = expectedAmountUnit === 'ntz' ? formatNtz : formatEth;
    const decimals = expectedAmountUnit === 'ntz' ? NTZ_DECIMALS : ETH_DECIMALS;

    return (
      <div style={{ maxWidth: 480 }}>
        {title && <H2>{title}</H2>}

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <AmountField
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
  handleExchange: PropTypes.func,
  amount: PropTypes.number,
  title: PropTypes.node,
  amountUnit: PropTypes.string.isRequired,
  reset: PropTypes.func,
};

export default ExchangeDialog;
