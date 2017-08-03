import React from 'react';
import PropTypes from 'prop-types';
import ethUtil from 'ethereumjs-util';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { reduxForm } from 'redux-form/immutable';

import { makeSelectHasWeb3, makeSelectNetworkSupported } from '../../containers/AccountProvider/selectors';

import DefaultDialog from '../../components/TransferDialog/Default';
import TokenDialog from '../../components/TransferDialog/TokenDialog';

const isEthereumAddress = (address) => ethUtil.isValidAddress(address) || ethUtil.isValidChecksumAddress(address);

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

const DIALOGS = {
  token: TokenDialog,
  default: DefaultDialog,
};

const TransferDialogContainer = (props) => {
  const SpecifiedDialog = DIALOGS[props.type];
  return <SpecifiedDialog name="transfer-dialog" {...props} />;
};
TransferDialogContainer.propTypes = {
  type: PropTypes.oneOf(['default', 'token']),
};
TransferDialogContainer.defaultProps = {
  type: 'default',
};

const mapStateToProps = createStructuredSelector({
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'transfer',
    validate,
    warn,
  })(TransferDialogContainer)
);
