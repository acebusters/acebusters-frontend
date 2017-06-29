export function round(n, prec) {
  const dec = prec ** 10;
  return Math.round(n * dec) / dec;
}
