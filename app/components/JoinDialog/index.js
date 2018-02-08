import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';
import Slider from 'components/Form/Slider';
import Web3Alerts from 'containers/Web3Alerts';
import TxSubmit from 'containers/TxSubmit';
import messages from 'containers/JoinDialog/messages';
import H2 from 'components/H2';
import SubmitButton from 'components/SubmitButton';

import { formatNtz } from '../../utils/amountFormatter';

import { ABI_TOKEN_CONTRACT, conf } from '../../app.config';

export class JoinDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
  }

  get web3() {
    return this.props.web3Redux.web3;
  }

  handleSubmit(values) {
    return this.props.onJoin(values.get('amount'));
  }

  render() {
    const {
      handleSubmit,
      estimate,
      amount,
      submitting,
      onLeave,
      rebuy,
      signerAddr,
      modalDismiss,
      tableStakes: {
        sb,
        min,
        tableMax,
      },
    } = this.props;
    const balance = this.token.balanceOf(signerAddr) || 0;
    const max = BigNumber.min(balance, tableMax).div(sb).floor().mul(sb);

    if (balance < min) {
      if (!new BigNumber(0).eq(balance)) {
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
        <div style={{ minWidth: '20em' }}>
          <H2><FormattedMessage {...messages.fundRequestInProgress} /></H2>
          <p><FormattedMessage {...messages.fundRequestInProgressMessage} /></p>
          <SubmitButton onClick={modalDismiss}>
            <FormattedMessage {...messages.ok} />
          </SubmitButton>
        </div>
      );
    }

    return (
      <Form style={{ maxWidth: '30em' }} onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          component={Slider}
          name="amount"
          value={amount}
          onAfterChange={(value) => this.props.changeFieldValue('join', 'amount', value)}
          onChange={(value) => this.props.changeFieldValue('join', 'amount', value)}
          min={min}
          max={max.toNumber()}
          step={sb}
        />
        <div><FormattedMessage {...messages.max} /> {formatNtz(max)} NTZ</div>
        <div>{formatNtz(amount)} NTZ</div>

        <Web3Alerts />

        <TxSubmit
          estimate={estimate}
          estimateArgs={amount || min}
          submitting={submitting}
          submitButtonLabel={
            <FormattedMessage {...(rebuy ? messages.rebuy : messages.join)} />
          }
          onCancel={rebuy ? onLeave : undefined}
          cancelButtonLabel={<FormattedMessage {...messages.leave} />}
          possibleFailReason="Maybe seat is already taken by other player"
        />
      </Form>
    );
  }
}
JoinDialog.propTypes = {
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  modalDismiss: PropTypes.func,
  rebuy: PropTypes.bool,
  handleSubmit: PropTypes.func,
  estimate: PropTypes.func,
  tableStakes: PropTypes.object,
  web3Redux: PropTypes.object,
  signerAddr: PropTypes.string,
  submitting: PropTypes.bool,
  amount: PropTypes.number,
  // balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  changeFieldValue: PropTypes.func,
};

export default JoinDialog;
