import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Form, reduxForm, formValueSelector } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import { makeSelectInjectedAccount, makeSelectNetworkSupported } from '../../containers/AccountProvider/selectors';
import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import AmountField from '../../components/AmountField';
import H2 from '../../components/H2';

import { NTZ_DECIMALS, ETH_DECIMALS, formatNtz, formatEth } from '../../utils/amountFormatter';
import { round } from '../../utils/round';

import messages from './messages';

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

class ExchangeDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return this.props.handleExchange(values.get('amount'));
  }

  render() {
    const {
      handleSubmit,
      submitting,
      maxAmount,
      amount = 0,
      calcExpectedAmount,
      amountUnit,
      title,
      invalid,
      injected,
      networkSupported,
    } = this.props;
    const expectedAmountUnit = amountUnit.toLowerCase() === 'ntz' ? 'eth' : 'ntz';
    const formatExpValue = expectedAmountUnit === 'ntz' ? formatNtz : formatEth;
    const decimals = expectedAmountUnit === 'ntz' ? NTZ_DECIMALS : ETH_DECIMALS;

    return (
      <div>
        {title &&
          <H2>{title}</H2>
        }

        {calcExpectedAmount &&
          <FormattedMessage
            {...messages.expectedAmount}
            values={{
              amount: formatExpValue(calcExpectedAmount(round(amount, 10)).mul(decimals)),
              unit: expectedAmountUnit.toUpperCase(),
            }}
          />
        }

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <AmountField
            name="amount"
            component={FormField}
            label={`Amount (${amountUnit.toUpperCase()})`}
            maxAmount={maxAmount}
          />

          {!injected && <NoWeb3Message />}
          {!networkSupported && <UnsupportedNetworkMessage />}

          <SubmitButton
            disabled={invalid || !injected || !networkSupported}
            submitting={submitting}
          >
            Submit
          </SubmitButton>
        </Form>
      </div>
    );
  }
}

ExchangeDialog.propTypes = {
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  networkSupported: PropTypes.bool,
  injected: PropTypes.string,
  maxAmount: PropTypes.object, // BigNumber
  calcExpectedAmount: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleExchange: PropTypes.func,
  amount: PropTypes.number,
  title: PropTypes.node,
  amountUnit: PropTypes.string.isRequired,
};

const valueSelector = formValueSelector('exchange');

const mapStateToProps = (state) => ({
  amount: valueSelector(state, 'amount'),
  injected: makeSelectInjectedAccount()(state),
  networkSupported: makeSelectNetworkSupported()(state),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'exchange',
    validate,
    warn,
  })(ExchangeDialog)
);
