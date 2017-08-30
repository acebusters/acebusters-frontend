import React from 'react';
import { FormattedMessage } from 'react-intl';
import partition from 'lodash/partition';
import BigNumber from 'bignumber.js';

import A from '../../components/A';
import WithLoading from '../../components/WithLoading';
import { conf } from '../../app.config';
import { formatEth, formatNtz } from '../../utils/amountFormatter';

import { Icon, TypeIcon, typeIcons } from './styles';
import messages from './messages';
import { isSellEvent, isETHPayoutEvent, isPurchaseStartEvent, isPurchaseEndEvent, formatDate } from './utils';

const confParams = conf();

export function txnsToList(events, tableAddrs, proxyAddr) {
  if (!tableAddrs || !events) {
    return null;
  }

  const [pending, completed] = partition(
    events.sort((a, b) => b.blockNumber - a.blockNumber),
    (event) => event.pending,
  );
  return pending.concat(completed)
    .map((event) => [
      event.pending
        ? <WithLoading isLoading loadingSize="14px" type="inline" />
        : <TypeIcon>{typeIcons[event.type]}</TypeIcon>,
      formatTxAddress(event.address, tableAddrs, proxyAddr),
      formatDate(event.timestamp),
      infoIcon(event),
      formatValue(event),
      txDescription(event, tableAddrs, proxyAddr),
    ]);
}

const cutAddress = (addr) => addr.substring(2, 8);

function formatTxAddress(address, tableAddrs, proxyAddr) {
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
  } else if (address === proxyAddr) {
    return <FormattedMessage {...messages.me} />;
  }

  return cutAddress(address);
}

function formatValue(event) {
  if (event.value === undefined) {
    return '';
  }

  const sign = event.type === 'income' ? '' : '−';
  const formatFn = event.unit === 'ntz' ? formatNtz : formatEth;
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

function txDescription(event, tableAddrs, proxyAddr) {
  if (tableAddrs.indexOf(event.address) > -1) {
    return (
      <FormattedMessage
        {...(event.type === 'income' ? messages.tableLeave : messages.tableJoin)}
      />
    );
  } else if (event.address === confParams.pwrAddr) {
    return (
      <FormattedMessage
        {...(event.type === 'income' ? messages.powerDownPayoutStatus : messages.powerUpStatus)}
      />
    );
  } else if (isETHPayoutEvent(event)) {
    return <FormattedMessage {...messages.ethPayoutStatus} />;
  } else if (isSellEvent(event)) {
    return <FormattedMessage {...messages.sellStatus} />;
  } else if (isPurchaseEndEvent(event, proxyAddr)) {
    return <FormattedMessage {...messages.purchaseEnd} />;
  } else if (isPurchaseStartEvent(event)) {
    return <FormattedMessage {...messages.purchaseStart} />;
  }

  return <FormattedMessage {...messages.transferStatus} />;
}
