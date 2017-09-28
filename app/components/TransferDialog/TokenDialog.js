import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';

import Web3Alerts from '../../containers/Web3Alerts';
import { ErrorMessage } from '../FormMessages';
import SubmitButton from '../SubmitButton';
import FormField from '../Form/FormField';
import TokenAmountField from '../Form/TokenAmountField';

class TokenDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
      invalid,
      canSendTx,
      normalizer,
      placeholder,
    } = this.props;
    return (
      <div style={{ maxWidth: 480 }}>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            normalize={normalizer}
            name="amount"
            component={TokenAmountField}
            label="Amount"
            autoFocus
            maxAmount={maxAmount}
            minAmount={minAmount}
            modalAdd={this.props.modalAdd}
            modalDismiss={this.props.modalDismiss}
            amountUnit={this.props.amountUnit}
            setAmountUnit={this.props.setAmountUnit}
            reset={this.props.reset}
            placeholder={placeholder}
          />

          <Field
            name="address"
            component={FormField}
            type="text"
            label="Ethereum address"
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Web3Alerts />

          <SubmitButton
            type="submit"
            disabled={invalid || !canSendTx}
            submitting={submitting}
          >
            Submit
          </SubmitButton>
        </Form>
      </div>
    );
  }
}
TokenDialog.propTypes = {
  canSendTx: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  minAmount: PropTypes.object, // BigNumber
  handleSubmit: PropTypes.func,
  handleTransfer: PropTypes.func,
  error: PropTypes.any,
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
  amountUnit: PropTypes.string,
  setAmountUnit: PropTypes.func,
  reset: PropTypes.func,
  normalizer: PropTypes.func,
  placeholder: PropTypes.string,
};
TokenDialog.defaultProps = {
  minAmount: new BigNumber(0),
};

export default TokenDialog;
