import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

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
