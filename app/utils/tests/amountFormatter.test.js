import BigNumber from 'bignumber.js';
import { formatAmount, ETH_DECIMALS } from '../amountFormatter';

describe('formatAmount', () => {
  it('should convert value according decimals and format this amount', () => {
    expect(formatAmount(ETH_DECIMALS, new BigNumber(1).mul(ETH_DECIMALS))).toEqual('1');
    expect(formatAmount(ETH_DECIMALS, new BigNumber(1000).mul(ETH_DECIMALS))).toEqual('1,000');
    expect(formatAmount(ETH_DECIMALS, new BigNumber(1000).mul(ETH_DECIMALS).toString())).toEqual('1,000');
    expect(formatAmount(ETH_DECIMALS, new BigNumber(1000.54).mul(ETH_DECIMALS).toString())).toEqual('1,000.54');
    expect(formatAmount(ETH_DECIMALS, new BigNumber(1000.55).mul(ETH_DECIMALS).toString(), 1)).toEqual('1,000.6');
  });

  it('should returns 0 for null or undefined amount', () => {
    expect(formatAmount(ETH_DECIMALS, null)).toEqual('0');
    expect(formatAmount(ETH_DECIMALS)).toEqual('0');
    expect(formatAmount(ETH_DECIMALS, null, 2)).toEqual('0.00');
  });
});
