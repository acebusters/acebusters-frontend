import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import EthUtil from 'ethereumjs-util';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

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
  <div>
    <label htmlFor={input.name}>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);
/* eslint-enable react/prop-types */

class TransferDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return values;
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="amount" component={renderField} type="number" placeholder="amount" />
          <Field name="address" component={renderField} type="text" placeholder="address" />
          {error && <strong>{error}</strong>}
          <div>
            <button type="submit" disabled={submitting}>Submit</button>
          </div>
        </Form>
      </div>
    );
  }
}

TransferDialog.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'transfer', validate, warn })(TransferDialog));
