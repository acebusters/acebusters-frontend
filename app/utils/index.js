export const indentity = (a) => a;

export const last = (arr) => arr[arr.length - 1];

export const not = (fn) => (...args) => !fn(...args);

export function round(n, prec) {
  const dec = 10 ** prec;
  return Math.round(n * dec) / dec;
}
