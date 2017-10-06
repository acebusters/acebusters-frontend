import { connect } from 'react-redux';
import JoinDialog from 'components/JoinDialog';
import { reduxForm, formValueSelector } from 'redux-form/immutable';

import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';

import { makeSbSelector } from '../Table/selectors';
import { makeSelectProxyAddr, makeSelectCanSendTx } from '../AccountProvider/selectors';

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const valueSelector = formValueSelector('join');
const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  proxyAddr: makeSelectProxyAddr(),
  canSendTx: makeSelectCanSendTx(),
  amount: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'join' })(JoinDialog)
);
