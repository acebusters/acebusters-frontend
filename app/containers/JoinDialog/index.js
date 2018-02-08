import JoinDialog from 'components/JoinDialog';
import { reduxForm, formValueSelector, change as changeFieldValue } from 'redux-form/immutable';

import { createStructuredSelector } from 'reselect';

import { modalDismiss } from '../App/actions';
import { makeSbSelector, makeTableStakesSelector } from '../Table/selectors';
import { makeSignerAddrSelector } from '../AccountProvider/selectors';
import web3Connect from '../AccountProvider/web3Connect';

const valueSelector = formValueSelector('join');

const mapDispatchToProps = (dispatch) => ({
  modalDismiss: () => dispatch(modalDismiss()),
  changeFieldValue: (form, field, value) => dispatch(changeFieldValue(form, field, value)),
});

const mapStateToProps = createStructuredSelector({
  signerAddr: makeSignerAddrSelector(),
  amount: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
  tableStakes: makeTableStakesSelector(),
});

export default web3Connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'join' })(JoinDialog)
);
