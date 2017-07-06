import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Form, Field, reduxForm } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';

import { ErrorMessage } from '../../components/FormMessages';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import H2 from '../../components/H2';

import { isEthereumAddress } from './isEthereumAddress';

const validate = (values, props) => {
  const errors = {};
  if (!values.get('amount')) {
    errors.amount = 'Required';
  }

  if (!values.get('address') && !props.hideAddress) {
    errors.address = 'Required';
  } else if (!isEthereumAddress(values.get('address'))) {
    errors.address = 'Invalid Ethereum Address.';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

class TransferDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.handleTransfer(
      values.get('amount'),
      values.get('address'),
    );
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      amountUnit,
      maxAmount,
      hideAddress,
      title,
      description,
    } = this.props;

    const limitAmount = (value) => {
      const numValue = Math.max(0, Number(value));

      return maxAmount.gte(new BigNumber(numValue)) ? numValue : maxAmount.toNumber();
    };

    return (
      <div>
        {title && <H2>{title}</H2>}
        {description && <p>{description}</p>}
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="amount"
            component={FormField}
            type="number"
            label={`Amount (${amountUnit})`}
            normalize={maxAmount && limitAmount}
          />

          {!hideAddress &&
            <Field
              name="address"
              component={FormField}
              type="text"
              label="Ethereum address"
            />
          }

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={submitting}>Submit</SubmitButton>
        </Form>
      </div>
    );
  }
}

TransferDialog.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  submitting: PropTypes.bool,
  hideAddress: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  amountUnit: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleTransfer: PropTypes.func,
  error: PropTypes.any,
};

TransferDialog.defaultProps = {
  hideAddress: false,
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
    form: 'transfer',
    validate,
    warn,
  })(TransferDialog)
);
