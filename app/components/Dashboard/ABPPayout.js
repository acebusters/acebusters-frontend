import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TxSubmit from '../../containers/TxSubmit';

import H2 from '../H2';
import Timed from '../Timed';

import { formatAbp } from '../../utils/amountFormatter';
import { formatDate } from '../../containers/Dashboard/utils';
import { SectionOverview } from './styles';

export default function ABPPayout({ downs, downtime, handlePayout, estimatePayout, pending, messages }) {
  const nextPayoutDate = nextPayout(...downs, downtime);
  return (
    <SectionOverview
      name="power-down-requests"
      style={{
        alignItems: 'center',
      }}
    >
      <H2><FormattedMessage {...messages.powerDownPayout} /></H2>
      <p style={{ margin: '-5px 0 10px' }}>
        <span style={{ fontSize: 18 }}>
          {formatAbp(downs[0].sub(downs[1]))}
        </span>
        /{formatAbp(downs[0])} ABP payed-out
      </p>

      <div style={{ margin: '-10px 0 10px', fontSize: 12, color: '#999' }}>
        <PayoutDate request={downs} downtime={downtime} />
      </div>

      <Timed until={nextPayoutDate}>
        {(disabled) => (
          <TxSubmit
            estimate={estimatePayout}
            esitmateArgs={[]}
            invalid={disabled}
            submitting={pending}
            onSubmit={handlePayout}
            submitButtonLabel="Execute Pay-Out"
          />
        )}
      </Timed>
    </SectionOverview>
  );
}

ABPPayout.propTypes = {
  downs: PropTypes.array,
  downtime: PropTypes.object,
  handlePayout: PropTypes.func,
  estimatePayout: PropTypes.func,
  pending: PropTypes.bool,
  messages: PropTypes.object,
};

export function nextPayout(total, left, start, downtime) {
  const nextStep = Math.floor(total.sub(left).div(total.mul(0.1)).toNumber()) + 1;

  return Math.min(
    Number(start) + downtime.div(10).mul(nextStep).toNumber(),
    Number(start) + downtime.toNumber()
  );
}

/* eslint-disable react/no-multi-comp, react/prop-types */
export class PayoutDate extends React.Component {
  constructor(props) {
    super(props);
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { request, downtime } = this.props;
    const nextDate = nextPayout(...request, downtime);

    if (nextDate > Date.now()) {
      return (
        <span>
          Next pay-out: {formatDate(nextDate)}
        </span>
      );
    }

    return null;
  }
}
/* eslint-enable */

