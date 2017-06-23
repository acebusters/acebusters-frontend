import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Form, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import { ErrorMessage } from '../../components/FormMessages';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import AmountField from '../../components/AmountField';
import H2 from '../../components/H2';

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

class PurchaseDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.handlePurchase(values.get('amount'));
  }

  render() {
    const { error, handleSubmit, submitting, maxAmount } = this.props;

    return (
      <div>
        <H2><FormattedMessage {...messages.header} /></H2>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <AmountField
            name="amount"
            component={FormField}
            label="Amount (ETH)"
            maxAmount={maxAmount}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton disabled={submitting}>Submit</SubmitButton>
        </Form>
      </div>
    );
  }
}

PurchaseDialog.propTypes = {
  submitting: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  handleSubmit: PropTypes.func,
  handlePurchase: PropTypes.func,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'purchase',
    validate,
    warn,
  })(PurchaseDialog)
);
