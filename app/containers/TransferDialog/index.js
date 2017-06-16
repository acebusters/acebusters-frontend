import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import EthUtil from 'ethereumjs-util';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

import messages from './messages';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Label from '../../components/Label';
import H2 from '../../components/H2';
import FormGroup from '../../components/Form/FormGroup';
import { ErrorMessage } from '../../components/FormMessages';

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isAddress = (address) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  }
  // Otherwise check each case
  return isChecksumAddress(address);
};
/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
const isChecksumAddress = (addr) => {
  // Check each case
  const address = addr.replace('0x', '');
  const addressHash = EthUtil.sha3(address.toLowerCase());
  for (let i = 0; i < 40; i += 1) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if ((parseInt(addressHash[i], 16) > 7
      && address[i].toUpperCase() !== address[i])
      || (parseInt(addressHash[i], 16) <= 7
        && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
};

const validate = (values) => {
  // console.log(props);
  const errors = {};
  if (!values.get('amount')) {
    errors.amount = 'Required';
  }

  if (!values.get('address')) {
    errors.address = 'Required';
  } else if (!isAddress(values.get('address'))) {
    errors.address = 'Invalid Ethereum Address.';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

/* eslint-disable react/prop-types */
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <Label htmlFor={input.name}>{label}</Label>
    <Input {...input} type={type} />
    {touched && ((error && <ErrorMessage error={error}></ErrorMessage>) || (warning && <ErrorMessage error={warning}></ErrorMessage>))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

class TransferDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.handleTransfer(
      values.get('address'),
      values.get('amount')
    );
  }

  render() {
    const { error, handleSubmit, submitting, amountUnit, maxAmount } = this.props;

    const limitAmount = (value) => {
      const numValue = Math.max(0, Number(value));

      return maxAmount.gte(new BigNumber(numValue)) ? numValue : maxAmount.toNumber();
    };

    return (
      <div>
        <H2><FormattedMessage {...messages.header} /></H2>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="amount"
            component={renderField}
            type="number"
            label={`Amount (${amountUnit})`}
            normalize={maxAmount && limitAmount}
          />
          <Field
            name="address"
            component={renderField}
            type="text"
            label="Ethereum address"
          />
          {error && <strong>{error}</strong>}
          <div>
            <Button type="submit" disabled={submitting}>Submit</Button>
          </div>
        </Form>
      </div>
    );
  }
}

TransferDialog.propTypes = {
  submitting: PropTypes.bool,
  maxAmount: PropTypes.object, // BigNumber
  amountUnit: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleTransfer: PropTypes.func,
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
    form: 'transfer',
    validate,
    warn,
  })(TransferDialog)
);
