import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import { ErrorMessage } from '../FormMessages';
import SubmitButton from '../SubmitButton';
import FormField from '../Form/FormField';
import H2 from '../H2';

class DefaultDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return this.props.handleTransfer(
      values.get('amount'),
      values.get('address'),
    ).then(() => this.props.reset());
  }

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      maxAmount,
      minAmount,
      hideAddress,
      title,
      description,
      invalid,
      hasWeb3,
      networkSupported,
      normalizer,
      label,
      placeholder,
    } = this.props;

    return (
      <div>
        {title && <H2>{title}</H2>}
        {description && <p>{description}</p>}
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            normalize={normalizer}
            name="amount"
            component={FormField}
            autoFocus
            minAmount={minAmount}
            maxAmount={maxAmount}
            label={label}
            placeholder={placeholder}
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

          {!hasWeb3 && <NoWeb3Message />}
          {hasWeb3 && !networkSupported && <UnsupportedNetworkMessage />}

          <SubmitButton
            type="submit"
            disabled={invalid || !hasWeb3 || !networkSupported}
            submitting={submitting}
          >
            Submit
          </SubmitButton>
        </Form>
      </div>
    );
  }
}
DefaultDialog.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  hasWeb3: PropTypes.bool,
  networkSupported: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  hideAddress: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  minAmount: PropTypes.object, // BigNumber
  handleSubmit: PropTypes.func,
  handleTransfer: PropTypes.func,
  error: PropTypes.any,
  reset: PropTypes.func,
  normalizer: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  placeholder: PropTypes.string,
};

DefaultDialog.defaultProps = {
  hideAddress: false,
  minAmount: new BigNumber(0),
};

export default DefaultDialog;
