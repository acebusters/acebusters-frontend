import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';
import NoWeb3Message from '../../components/Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../../components/Web3Alerts/UnsupportedNetwork';
import FormGroup from '../../components/Form/FormGroup';

import { makeSbSelector } from '../Table/selectors';
import { makeSelectProxyAddr, makeSelectHasWeb3, makeSelectNetworkSupported } from '../AccountProvider/selectors';
import { formatNtz } from '../../utils/amountFormatter';

/* eslint-disable react/prop-types */
const renderSlider = ({ input, ...props }) => (
  <FormGroup>
    <Slider
      data-orientation="vertical"
      tooltip={false}
      {...input}
      {...props}
    />
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return this.props.handleJoin(this.props.pos, values.get('amount'));
  }

  render() {
    const {
      sb,
      hasWeb3,
      balance,
      modalDismiss,
      networkSupported,
      handleSubmit,
      amount,
      submitting,
    } = this.props;

    const min = sb * 40;
    const tableMax = sb * 200;
    const max = (balance < tableMax) ? balance - (balance % sb) : tableMax;
    if (balance < min) {
      return (
        <div style={{ minWidth: '20em' }}>
          <H2>Sorry!</H2>
          <p>Your balance is not sufficient to join this table!</p>
          <SubmitButton onClick={modalDismiss}>OK</SubmitButton>
        </div>
      );
    }
    return (
      <Form style={{ minWidth: '20em' }} onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          component={renderSlider}
          name="amount"
          min={min}
          max={max}
          step={sb}
        />
        <div>Max: {formatNtz(max)} NTZ</div>
        <div>{formatNtz(amount)} NTZ</div>

        {!hasWeb3 && <NoWeb3Message />}
        {!networkSupported && <UnsupportedNetworkMessage />}

        <SubmitButton
          disabled={!hasWeb3 || !networkSupported}
          submitting={submitting}
        >
          Join
        </SubmitButton>
      </Form>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const valueSelector = formValueSelector('join');
const mapStateToProps = createStructuredSelector({
  sb: makeSbSelector(),
  proxyAddr: makeSelectProxyAddr(),
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
  amount: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
});

JoinDialog.propTypes = {
  handleJoin: PropTypes.func,
  handleSubmit: PropTypes.func,
  modalDismiss: PropTypes.func,
  hasWeb3: PropTypes.bool,
  networkSupported: PropTypes.bool,
  pos: PropTypes.any,
  sb: PropTypes.number,
  submitting: PropTypes.bool,
  amount: PropTypes.number,
  balance: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'join' })(JoinDialog)
);
