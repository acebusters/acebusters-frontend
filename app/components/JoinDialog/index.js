import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'redux-form/immutable';
import SubmitButton from 'components/SubmitButton';
import RangeSlider from 'components/Slider/RangeSlider';
import H2 from 'components/H2';
import Web3Alerts from 'containers/Web3Alerts';
import messages from 'containers/JoinDialog/messages';

import { formatNtz } from '../../utils/amountFormatter';

import { ButtonContainer } from './styles';

export class JoinDialog extends React.Component {
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
          component={RangeSlider}
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

export default JoinDialog;
