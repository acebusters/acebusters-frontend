export const identity = (a) => a;

export const last = (arr, n = 1) => arr[arr.length - n];

export const not = (fn) => (...args) => !fn(...args);

export function round(n, prec) {
  const dec = 10 ** prec;
  return Math.round(n * dec) / dec;
}
