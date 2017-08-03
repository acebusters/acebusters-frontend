import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { conf } from '../../app.config';
const confParams = conf();

export function isSellStartEvent(event) {
  return (
    event.address === confParams.ntzAddr &&
    event.unit === 'ntz' &&
    event.type === 'outcome'
  );
}

export function isSellEndEvent(event) {
  return (
    event.address === confParams.ntzAddr &&
    event.unit === 'eth' &&
    event.type === 'income'
  );
}

export function isPurchaseEndEvent(event, proxyAddr) {
  return event.address === proxyAddr && event.unit === 'ntz';
}

export function isPurchaseStartEvent(event) {
  return event.address === confParams.ntzAddr && event.unit === 'eth';
}

export function formatDate(timestamp) {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp * 1000);

  return (
    <span>
      <FormattedDate
        value={date}
        year="numeric"
        month="numeric"
        day="2-digit"
      />,&nbsp;
      <FormattedTime
        value={date}
        hour12={false}
      />
    </span>
  );
}

