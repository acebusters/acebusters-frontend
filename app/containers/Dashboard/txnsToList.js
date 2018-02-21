import React from 'react';
import { FormattedMessage } from 'react-intl';
import partition from 'lodash/partition';
import BigNumber from 'bignumber.js';

import A from '../../components/A';
import WithLoading from '../../components/WithLoading';
import { conf } from '../../app.config';
import { formatEth, formatNtz } from '../../utils/amountFormatter';

import { Icon, TypeIcon, Error, ErrorIcon, typeIcons } from './styles';
import messages from './messages';
import { formatDate } from './utils';

const confParams = conf();

export function txnsToList(events, tableAddrs, address) {
  if (!tableAddrs || !events) {
    return null;
  }

  const [pending, completed] = partition(
    events.sort((a, b) => {
      if ((b.blockNumber - a.blockNumber) === 0) {
        return (b.unit === 'eth' ? 0 : 1) - (a.unit === 'eth' ? 0 : 1);
      }

      return b.blockNumber - a.blockNumber;
    }),
    (event) => event.pending,
  );
  return pending.concat(completed)
    .map((event) => [
      eventIcon(event),
      formatTxAddress(event.address, tableAddrs, address),
      formatDate(event.timestamp),
      infoIcon(event),
      formatValue(event),
      [
        txDescription(event, tableAddrs, address),
        event.error && <Error key="err"> ({event.error})</Error>,
      ],
    ]);
}

const cutAddress = (addr) => addr.substring(2, 8);

function eventIcon(event) {
  if (event.error) {
    return <ErrorIcon className="fa fa-times" />;
  }
  if (event.pending) {
    return <WithLoading isLoading loadingSize="14px" type="inline" />;
  }

  return <TypeIcon>{typeIcons[event.type]}</TypeIcon>;
}

function formatTxAddress(address, tableAddrs, userAddr) {
  const economyAddrs = [confParams.pwrAddr, confParams.pullAddr, confParams.ntzAddr];

  if (economyAddrs.indexOf(address) > -1) {
    return <FormattedMessage {...messages.acebusters} />;
  } else if (tableAddrs.indexOf(address) > -1) {
    return (
      <FormattedMessage
        {...messages.tableAddress}
        values={{
          address: cutAddress(address),
        }}
      />
    );
  } else if (address === userAddr) {
    return <FormattedMessage {...messages.me} />;
  }

  return cutAddress(address);
}

const formatters = {
  ntz: formatNtz,
  eth: formatEth,
};

function formatValue(event) {
  if (event.value === undefined) {
    return '';
  }

  const sign = event.type === 'income' ? '' : '−';
  const formatFn = formatters[event.unit];
  const number = formatFn(new BigNumber(event.value));
  return `${sign}${number.toString()} ${event.unit.toUpperCase()}`;
}

function infoIcon(event) {
  return (
    <A
      href={`${confParams.etherscanUrl}tx/${event.transactionHash}`}
      target="_blank"
    >
      <Icon
        className="fa fa-info-circle"
        aria-hidden="true"
      />
    </A>
  );
}

// eslint-disable-next-line consistent-return
function txDescription(event, tableAddrs) {
  if (tableAddrs.indexOf(event.address) > -1) {
    return (
      <FormattedMessage
        key="descr"
        {...(event.type === 'income' ? messages.tableLeave : messages.tableJoin)}
      />
    );
  }
}
