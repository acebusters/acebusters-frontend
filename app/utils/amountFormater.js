import BigNumber from 'bignumber.js';

// ether units: https://github.com/ethereum/web3.js/blob/0.15.0/lib/utils/utils.js#L40
export const ETH_DECIMALS = new BigNumber(10).pow(18);

// acebuster units:
// 1 x 10^12 - Nutz   (NTZ)
// 1 x 10^9 - Jonyz
// 1 x 10^6 - Helcz
// 1 x 10^3 - Pascalz
// 1 x 10^0 - Babz
export const NTZ_DECIMALS = new BigNumber(10).pow(12);

export function formatNtz(babzAmount, decimals = 0) {
  const babzAmountBn = (typeof babzAmount === 'object') ? babzAmount : new BigNumber(babzAmount || 0);
  return babzAmountBn.div(NTZ_DECIMALS).toFormat(decimals);
}

export function formatEth(weiAmount, decimals) {
  const weiAmountBn = (typeof weiAmount === 'object') ? weiAmount : new BigNumber(weiAmount || 0);
  const decimalPlaces = decimals || weiAmountBn.div(ETH_DECIMALS).dp();
  return weiAmountBn.div(ETH_DECIMALS).toFormat(decimalPlaces);
}
