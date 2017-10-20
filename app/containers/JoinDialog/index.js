import { connect } from 'react-redux';
import JoinDialog from 'components/JoinDialog';
import { reduxForm, formValueSelector, change as changeFieldValue } from 'redux-form/immutable';

import { createStructuredSelector } from 'reselect';

import { modalDismiss } from '../App/actions';
import { makeSbSelector, makeTableStakesSelector } from '../Table/selectors';
import { makeSelectProxyAddr, makeSelectCanSendTx } from '../AccountProvider/selectors';

const valueSelector = formValueSelector('join');

const mapDispatchToProps = (dispatch) => ({
  modalDismiss: () => dispatch(modalDismiss()),
  changeFieldValue: (form, field, value) => dispatch(changeFieldValue(form, field, value)),
});

const mapStateToProps = createStructuredSelector({
  proxyAddr: makeSelectProxyAddr(),
  canSendTx: makeSelectCanSendTx(),
  amount: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
  tableStakes: makeTableStakesSelector(),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'join' })(JoinDialog)
);
