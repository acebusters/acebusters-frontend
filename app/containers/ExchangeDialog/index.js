import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { stopSubmit } from 'redux-form';

import { validateFloat } from '../../utils/inputValidators';
import ExchangeDialog from '../../components/ExchangeDialog';
import messages from './messages';

import { makeSelectCanSendTx } from '../AccountProvider/selectors';
import { modalAdd, modalDismiss } from '../App/actions';
import { setAmountUnit } from '../Dashboard/actions';

const validate = (values, props) => {
  const errors = {};
  const { maxAmount, minAmount = 0 } = props;
  const amount = values.get('amount');

  return validateFloat(messages, errors, amount, minAmount, maxAmount);
};

const warn = () => {
  const warnings = {};
  return warnings;
};

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector(ownProps.form);
  return {
    messages,
    amount: valueSelector(state, 'amount'),
    canSendTx: makeSelectCanSendTx()(state),
  };
};

function mapDispatchToProps(dispatch, ownProps) {
  return {
    modalAdd: (...args) => dispatch(modalAdd(...args)),
    modalDismiss: (...args) => dispatch(modalDismiss(...args)),
    setAmountUnit: (...args) => dispatch(setAmountUnit(...args)),
    stopSubmit: (errors) => dispatch(stopSubmit(ownProps.form, errors)),
  };
}

export default reduxForm({
  validate,
  warn,
})(
  connect(mapStateToProps, mapDispatchToProps)(ExchangeDialog)
);
