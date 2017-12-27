import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';
import { stopSubmit } from 'redux-form';

import { validateFloat } from '../../utils/inputValidators';
import ExchangeDialog from '../../components/ExchangeDialog';
import messages from './messages';

import { modalAdd, modalDismiss } from '../App/actions';
import { setAmountUnit } from '../Dashboard/actions';

const validate = (values, props) => {
  const { maxAmount, minAmount = 0 } = props;
  return validateFloat({
    messages,
    errors: {},
    amount: values.get('amount'),
    minAmount,
    maxAmount,
    onChange: (value) => props.dispatch(props.change('amount', String(value))),
  });
};

const mapStateToProps = (state, ownProps) => ({
  messages,
  amount: formValueSelector(ownProps.form)(state, 'amount'),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    modalAdd: (...args) => dispatch(modalAdd(...args)),
    modalDismiss: (...args) => dispatch(modalDismiss(...args)),
    setAmountUnit: (...args) => dispatch(setAmountUnit(...args)),
    stopSubmit: (errors) => dispatch(stopSubmit(ownProps.form, errors)),
  };
}

export default reduxForm({ validate })(
  connect(mapStateToProps, mapDispatchToProps)(ExchangeDialog)
);
