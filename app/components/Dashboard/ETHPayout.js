import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import WithLoading from '../../components/WithLoading';
import EstimateWarning from '../../containers/EstimateWarning';

import H2 from '../H2';
import TimedButton from '../TimedButton';
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
      {!pending &&
        <Timed until={payoutDate.toNumber()}>
          <EstimateWarning
            estimate={estimatePayout}
            args={[amount]}
          />
        </Timed>
      }
      <TimedButton
        until={payoutDate.toNumber()}
        onClick={() => handlePayout(amount)}
        disabled={pending}
      >
        Execute Pay-out
        {pending &&
          <WithLoading
            isLoading
            loadingSize="14px"
            type="inline"
            styles={{ outer: { marginLeft: 5 } }}
          />
        }
      </TimedButton>
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
