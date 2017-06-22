import { NTZ_DECIMALS } from '../app.config';

export function formatNtz(babzAmount, decimals = 0, decimalMark = '.', thousandSeparator = ',') {
  const s = babzAmount < 0 ? '-' : '';
  const ntzAmount = Math.abs(Number(babzAmount / NTZ_DECIMALS) || 0).toFixed(decimals);
  const intAmount = String(parseInt(ntzAmount, 10));
  const j = (intAmount.length) > 3 ? intAmount.length % 3 : 0;
  const p = intAmount.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousandSeparator}`);
  return `${s}${(j ? intAmount.substr(0, j) + thousandSeparator : '')}${p}${(decimals ? decimalMark + Math.abs(ntzAmount - intAmount).toFixed(decimals).slice(2) : '')}`;
}
