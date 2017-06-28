export function round(n, prec) {
  return Math.round(n * prec * 10) / prec / 10;
}
