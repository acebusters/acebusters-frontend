import React from 'react';

import { formatAbp } from '../../utils/amountFormatter';
import { formatDate } from './utils';
import Button from '../../components/Button';

export function downRequestsToList(
  downRequests,
  downtime,
  onTickClick
) {
  return downtime && downRequests && downRequests.map((r) => [
    `${formatAbp(r[2])} ABP`,
    `${formatAbp(r[2].sub(r[3]))} ABP`,
    formatDate(r[4].toNumber()),
    <PayoutDate request={r} downtime={downtime} />,
    <TickButton
      request={r}
      downtime={downtime}
      onClick={() => onTickClick(r[0])}
    />,
  ]);
}

function nextPayout(request, downtime) {
  const total = request[2];
  const left = request[3];
  const start = request[4].toNumber();
  const nextStep = Math.floor(total.sub(left).div(total.mul(0.1)).toNumber()) + 1;

  return Math.min(
    start + downtime.div(10).mul(nextStep).toNumber(),
    start + downtime.toNumber()
  );
}

/* eslint-disable react/no-multi-comp, react/prop-types */
class PayoutDate extends React.Component {
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
    return (
      <span>
        {formatDate(nextPayout(request, downtime))}
      </span>
    );
  }
}

class TickButton extends React.Component {
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
    const { request, downtime, onClick } = this.props;
    return (
      <Button
        disabled={nextPayout(request, downtime) > Date.now() / 1000}
        onClick={onClick}
      >
        Execute Pay-Out
      </Button>
    );
  }
}
/* eslint-enable */
