import { Receipt, Type } from 'poker-helper';
import { formatNtz } from '../../utils/amountFormatter';

export function receiptStringType(type) {
  return Object.keys(Type).find((key) => Type[key] === type);
}

export function parseDistributionReceipt(distribution, lineup) {
  if (!distribution) {
    return {};
  }

  const { outs } = Receipt.parse(distribution);

  return lineup.reduce((memo, seat, pos) => ({
    ...memo,
    [seat.address]: outs[pos],
  }), {});
}

export function renderNtz(amount) {
  if (amount) {
    return formatNtz(amount, 1);
  }

  return (amount === null || amount === undefined) ? '-' : amount;
}
