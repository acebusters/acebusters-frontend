import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';

import { Form, reduxForm, formValueSelector } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import AmountField from '../../components/AmountField';
import H2 from '../../components/H2';

import messages from './messages';

const ntzDecimals = new BigNumber(10).pow(12);
const ethDecimals = new BigNumber(10).pow(18);

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

class SellDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.handleSell(values.get('amount'));
  }

  render() {
    const { handleSubmit, submitting, maxAmount, floorPrice, amount = 0 } = this.props;

    return (
      <div>
        <H2><FormattedMessage {...messages.header} /></H2>

        <FormattedMessage
          {...messages.expectedAmount}
          values={{
            amount: floorPrice.div(ethDecimals.div(ntzDecimals)).mul(amount).toString(),
          }}
        />

        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <AmountField
            name="amount"
            component={FormField}
            label="Amount (NTZ)"
            maxAmount={maxAmount}
          />

          <div>
            <SubmitButton type="submit" disabled={submitting}>
              Submit
            </SubmitButton>
          </div>
        </Form>
      </div>
    );
  }
}

SellDialog.propTypes = {
  submitting: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  floorPrice: PropTypes.object, // BigNumber
  handleSubmit: PropTypes.func,
  handleSell: PropTypes.func,
  amount: PropTypes.number,
  // error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const valueSelector = formValueSelector('ntz-sell');

const mapStateToProps = (state) => ({
  amount: valueSelector(state, 'amount'),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'ntz-sell',
    validate,
    warn,
  })(SellDialog)
);
