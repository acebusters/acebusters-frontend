import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TxSubmit from '../../containers/TxSubmit';

import H2 from '../H2';
import Timed from '../Timed';

import { SectionOverview } from './styles';

export default function ETHPayout({ payoutDate, amount, handlePayout, estimatePayout, pending, messages }) {
  return (
    <SectionOverview
      name="eth-payout"
      style={{
        alignItems: 'center',
      }}
    >
      <H2><FormattedMessage {...messages.ethPayout} /></H2>
      <p style={{ fontSize: 18, margin: '-5px 0 10px' }}>
        {amount} ETH
      </p>

      <Timed until={payoutDate.toNumber()}>
        {(disabled) => (
          <TxSubmit
            estimate={estimatePayout}
            estimateArgs={[amount]}
            invalid={disabled}
            submitting={pending}
            onSubmit={() => handlePayout(amount)}
            submitButtonLabel="Execute Pay-Out"
          />
        )}
      </Timed>
    </SectionOverview>
  );
}

ETHPayout.propTypes = {
  payoutDate: PropTypes.object,
  amount: PropTypes.string,
  handlePayout: PropTypes.func,
  estimatePayout: PropTypes.func,
  pending: PropTypes.bool,
  messages: PropTypes.object,
};
