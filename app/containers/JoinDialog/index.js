import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { createStructuredSelector } from 'reselect';
import SubmitButton from '../../components/SubmitButton';
import H2 from '../../components/H2';
import FormGroup from '../../components/Form/FormGroup';
import Web3Alerts from '../../containers/Web3Alerts';

import { makeSbSelector } from '../Table/selectors';
import { makeSelectProxyAddr, makeSelectCanSendTx } from '../AccountProvider/selectors';
import { formatNtz } from '../../utils/amountFormatter';

import messages from './messages';

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

const ButtonContainer = styled.div`
  display: flex;

  & > * {
    flex: 1;
  }

  & > * + * {
    margin-left: 10px;
  }
`;

export class JoinDialog extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    return this.props.onJoin(values.get('amount'));
  }

  render() {
    const {
      sb,
      canSendTx,
      balance,
      modalDismiss,
      handleSubmit,
      amount,
      submitting,
      onLeave,
      rebuy,
    } = this.props;

    const min = sb * 40;
    const tableMax = sb * 200;
    const max = (balance < tableMax) ? balance - (balance % sb) : tableMax;
    if (balance < min) {
      return (
        <div style={{ minWidth: '20em' }}>
          <H2><FormattedMessage {...messages.sorry} /></H2>
          <p><FormattedMessage {...(rebuy ? messages.balanceOutRebuy : messages.balanceOutJoin)} /></p>
          <SubmitButton onClick={modalDismiss}>
            <FormattedMessage {...messages.ok} />
          </SubmitButton>
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
        <div><FormattedMessage {...messages.max} /> {formatNtz(max)} NTZ</div>
        <div>{formatNtz(amount)} NTZ</div>

        <Web3Alerts />

        <ButtonContainer>
          <SubmitButton
            disabled={!canSendTx}
            submitting={submitting}
          >
            <FormattedMessage {...(rebuy ? messages.rebuy : messages.join)} />
          </SubmitButton>
          {rebuy && onLeave &&
            <SubmitButton type="button" onClick={onLeave}>
              <FormattedMessage {...messages.leave} />
            </SubmitButton>
          }
        </ButtonContainer>
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
  canSendTx: makeSelectCanSendTx(),
  amount: (state) => valueSelector(state, 'amount'),
  initialValues: (state, props) => ({
    amount: makeSbSelector()(state, props) * 40,
  }),
});

JoinDialog.propTypes = {
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  rebuy: PropTypes.bool,
  handleSubmit: PropTypes.func,
  modalDismiss: PropTypes.func,
  canSendTx: PropTypes.bool,
  sb: PropTypes.number,
  submitting: PropTypes.bool,
  amount: PropTypes.number,
  balance: React.PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'join' })(JoinDialog)
);
