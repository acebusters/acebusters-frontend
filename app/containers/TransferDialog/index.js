import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { Form, Field, reduxForm } from 'redux-form/immutable';

import { makeSelectInjectedAccount, makeSelectNetworkSupported } from '../../containers/AccountProvider/selectors';
import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';
import { ErrorMessage } from '../../components/FormMessages';
import SubmitButton from '../../components/SubmitButton';
import FormField from '../../components/Form/FormField';
import AmountField from '../../components/AmountField';
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
    return this.props.handleTransfer(
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
      invalid,
      injected,
      networkSupported,
    } = this.props;

    return (
      <div>
        {title && <H2>{title}</H2>}
        {description && <p>{description}</p>}
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <AmountField
            name="amount"
            component={FormField}
            label={`Amount (${amountUnit})`}
            autoFocus
            maxAmount={maxAmount}
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

          {!injected && <NoWeb3Message />}
          {!networkSupported && <UnsupportedNetworkMessage />}

          <SubmitButton
            type="submit"
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

TransferDialog.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  injected: PropTypes.string,
  networkSupported: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
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

const mapStateToProps = createStructuredSelector({
  injected: makeSelectInjectedAccount(),
  networkSupported: makeSelectNetworkSupported(),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'transfer',
    validate,
    warn,
  })(TransferDialog)
);
