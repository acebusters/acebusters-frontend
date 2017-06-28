import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import BigNumber from 'bignumber.js';

import { Form, reduxForm, formValueSelector } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import AmountField from '../../components/AmountField';
import H2 from '../../components/H2';

import { NTZ_DECIMALS, ETH_DECIMALS, formatNtz, formatEth } from '../../utils/amountFormater';
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
    this.props.handleExchange(values.get('amount'));
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
              amount: formatExpValue(calcExpectedAmount(round(amount, 5)).mul(decimals)),
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

          <SubmitButton disabled={submitting}>Submit</SubmitButton>
        </Form>
      </div>
    );
  }
}

ExchangeDialog.propTypes = {
  submitting: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  calcExpectedAmount: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleExchange: PropTypes.func,
  amount: PropTypes.number,
  title: PropTypes.node,
  amountUnit: PropTypes.string.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const valueSelector = formValueSelector('exchange');

const mapStateToProps = (state) => ({
  amount: valueSelector(state, 'amount'),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'exchange',
    validate,
    warn,
  })(ExchangeDialog)
);
