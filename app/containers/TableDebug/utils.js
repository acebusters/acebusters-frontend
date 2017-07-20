import { Receipt } from 'poker-helper';
import { formatNtz } from '../../utils/amountFormatter';

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

export function parseLastReceiptAmount(receipt) {
  if (!receipt) {
    return null;
  }

  return Receipt.parse(receipt).amount;
}

export function renderNtz(amount) {
  if (amount) {
    return formatNtz(amount, 1);
  }

  return (amount === null || amount === undefined) ? '-' : amount;
}
