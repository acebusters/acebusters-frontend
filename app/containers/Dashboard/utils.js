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
