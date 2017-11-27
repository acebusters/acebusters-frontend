import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { conf, MAIN_NET_GENESIS_BLOCK } from '../../app.config';
const confParams = conf();

export function isSellEvent(event) {
  return (
    event.address === confParams.ntzAddr &&
    event.unit === 'ntz' &&
    event.type === 'outcome'
  );
}

export function isETHPayoutEvent(event) {
  return (
    event.address === confParams.pullAddr &&
    event.unit === 'eth' &&
    event.type === 'income'
  );
}

export function isABPPayoutEvent(event) {
  return (
    event.address === confParams.pwrAddr
    && event.type === 'income'
  );
}

export function isPurchaseEndEvent(event, proxyAddr) {
  return event.address === proxyAddr && event.unit === 'ntz';
}

export function isPurchaseStartEvent(event) {
  return event.address === confParams.ntzAddr && event.unit === 'eth';
}

export function isPowerUpEvent(event) {
  return event.address === confParams.pwrAddr && event.unit === 'abp' && event.type === 'income';
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

export function investIsAvailable(proxyAddr) {
  const isMainnet = conf().firstBlockHash === MAIN_NET_GENESIS_BLOCK;
  const inWhitelist = [
    '0x8f3a1e097738a3f6f19c06b97d160df6b3a1801a', // sergey
    '0x67be75fedee88a84cbdcf5c87616bb1bb746c57e', // johann
    '0x4a46401df761f2ccc022c83aa7a97aac7a35303a', // sunify
  ].indexOf(proxyAddr) !== -1;

  return !isMainnet || inWhitelist;
}
