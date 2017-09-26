import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import WithLoading from '../../components/WithLoading';

import H2 from '../H2';
import TimedButton from '../TimedButton';

import { formatAbp } from '../../utils/amountFormatter';
import { formatDate } from '../../containers/Dashboard/utils';
import { SectionOverview } from './styles';

export default function ABPPayout({ downs, downtime, handlePayout, pending, messages }) {
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

      <TimedButton
        until={nextPayout(...downs, downtime)}
        onClick={handlePayout}
        disabled={pending}
      >
        Execute Pay-Out
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

ABPPayout.propTypes = {
  downs: PropTypes.array,
  downtime: PropTypes.object,
  handlePayout: PropTypes.func,
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

