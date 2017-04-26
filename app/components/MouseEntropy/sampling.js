/* eslint no-multi-spaces: "off", key-spacing: "off", no-bitwise: "off" */

import Bits from './bits';

const withRandom  = (max) => (n) => Math.floor(n + (Math.random() * 1000)) % max;

const withTime    = (max) => (n) => (n + (new Date() * 1)) % max;

export const throttleSync = (fn, ms, context) => {
  let lastCall;

  return (...args) => {
    const now = new Date() * 1;

    if (lastCall && now - lastCall < ms) {
      return null;
    }

    lastCall = now;
    return fn.apply(context, args);
  };
};

export const byEightDirection = (function genByEightDirection() {
  const val     = (dx, dy) => {
    const k     = dy / dx;
    const base  = dy > 0 ? 0 : 4;
    let area;

    if (k >= 0 && k < 1)        area = 0;
    else if (k >= 1)            area = 1;
    else if (k <= -1)           area = 2;
    else if (k > -1 && k > 0)   area = 3;
    // the only case left is (dx === 0, dy === 0)
    // k === NaN
    else                        area = 1;

    return area + base;
  };
  const rand = (n) => withRandom(8)(withTime(8)(n));

  let prevPos = { x: 0, y: 0 };
  let lastValue;

  return (data) => {
    let bytes = [];
    let bitCount = 0;

    const dx      = data.x - prevPos.x;
    const dy      = data.y - prevPos.y;
    const value   = rand(val(dx, dy));

    bytes    = [value << 5];
    bitCount = 3;

    prevPos = {
      x: data.x,
      y: data.y,
    };

    // Note: only accept direction changes
    if (value === lastValue)   return null;

    lastValue = value;

    return new Bits(bytes, bitCount);
  };
}());
