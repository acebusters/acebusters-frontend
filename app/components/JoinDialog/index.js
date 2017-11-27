import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';
import Slider from 'components/Form/Slider';
import SubmitButton from 'components/SubmitButton';
import Web3Alerts from 'containers/Web3Alerts';
import EstimateWarning from 'containers/EstimateWarning';
import messages from 'containers/JoinDialog/messages';
import RebuyDialog from 'components/RebuyDialog';

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
      canSendTx,
      balance,
      handleSubmit,
      estimate,
      amount,
      submitting,
      onLeave,
      rebuy,
      tableStakes: {
        sb,
        min,
        tableMax,
      },
    } = this.props;
    const max = BigNumber.min(balance, tableMax).div(sb).floor().mul(sb);

    if (balance < min) {
      return <RebuyDialog messages={messages} {...this.props} />;
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

        {canSendTx &&
          <EstimateWarning
            estimate={estimate}
            args={[amount]}
          />
        }

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
  estimate: PropTypes.func,
  canSendTx: PropTypes.bool,
  tableStakes: PropTypes.object,
  submitting: PropTypes.bool,
  amount: PropTypes.number,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  changeFieldValue: PropTypes.func,
};

export default JoinDialog;
