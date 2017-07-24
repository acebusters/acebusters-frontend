export const last = (arr) => arr[arr.length - 1];

export const not = (fn) => (...args) => !fn(...args);

export function round(n, prec) {
  const dec = prec ** 10;
  return Math.round(n * dec) / dec;
}
