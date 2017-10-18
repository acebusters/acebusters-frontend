import React from 'react';
import PropTypes from 'prop-types';
import ethUtil from 'ethereumjs-util';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';

import { normalizerFloat } from '../../utils/amountFormatter';
import { validateFloat } from '../../utils/inputValidators';

import { makeSelectCanSendTx } from '../../containers/AccountProvider/selectors';
import { modalAdd, modalDismiss } from '../../containers/App/actions';
import { setAmountUnit } from '../../containers/Dashboard/actions';

import TokenDialog from '../../components/TransferDialog/TokenDialog';

const isEthereumAddress = (address) => ethUtil.isValidAddress(address) || ethUtil.isValidChecksumAddress(address);

const validate = (values, props) => {
  const errors = {};
  const { messages, maxAmount, minAmount = 0 } = props;
  const amount = values.get('amount');

  // address validation
  if (!values.get('address') && !props.hideAddress) {
    errors.address = 'Required';
  } else if (!isEthereumAddress(values.get('address'))) {
    errors.address = 'Invalid Ethereum Address.';
  }

  return validateFloat(messages, errors, amount, minAmount, maxAmount);
};

const warn = () => {
  const warnings = {};
  return warnings;
};

const DIALOGS = {
  token: TokenDialog,
};

const TransferDialogContainer = (props) => {
  const SpecifiedDialog = DIALOGS[props.type];
  return (
    <SpecifiedDialog
      name="transfer-dialog"
      normalizer={normalizerFloat}
      {...props}
    />
  );
};
TransferDialogContainer.propTypes = {
  type: PropTypes.oneOf(['token']),
};
TransferDialogContainer.defaultProps = {
  type: 'default',
};

const valueSelector = formValueSelector('transfer');
const fieldSelector = (field) => (state) => valueSelector(state, field);
const mapStateToProps = createStructuredSelector({
  canSendTx: makeSelectCanSendTx(),
  amount: fieldSelector('amount'),
  address: fieldSelector('address'),
});

export default connect(mapStateToProps, {
  modalAdd,
  modalDismiss,
  setAmountUnit,
})(
  reduxForm({
    form: 'transfer',
    validate,
    warn,
  })(TransferDialogContainer)
);
