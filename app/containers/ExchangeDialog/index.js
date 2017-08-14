import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form/immutable';

import ExchangeDialog from '../../components/ExchangeDialog';
import messages from './messages';

import {
  makeSelectHasWeb3,
  makeSelectNetworkSupported,
} from '../AccountProvider/selectors';

const validate = (values) => {
  const errors = {};
  if (!values.get('amount')) {
    errors.amount = 'Required';
  }

  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

const valueSelector = formValueSelector('exchange');

const mapStateToProps = (state) => ({
  messages,
  amount: valueSelector(state, 'amount'),
  hasWeb3: makeSelectHasWeb3()(state),
  networkSupported: makeSelectNetworkSupported()(state),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'exchange',
    validate,
    warn,
  })(ExchangeDialog)
);
