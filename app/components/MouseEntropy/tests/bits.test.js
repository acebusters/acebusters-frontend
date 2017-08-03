/* eslint no-multi-spaces: "off", key-spacing: "off", no-bitwise: "off" */

import Bits from '../bits';

describe('Bits Class', () => {
  it('append 2 bits each time', () => {
    const data = new Bits([0b11000011], 8);
    const listOfTwoBits = [
      3 << 6,
      1 << 6,
      2 << 6,
      0,
    ];

    listOfTwoBits.forEach((twoBits) => {
      data.appendBits(new Bits([twoBits], 2));
    });

    expect(data.bitCount).toBe(16);
    expect(data.bytes).toEqual([0b11000011, 0b11011000]);
  });

  it('append 3 bits each time, and original data not 8 bit aligned', () => {
    const data = new Bits([0b11000000], 6);
    const listOfThreeBits = [
      3 << 5,
      5 << 5,
      7 << 5,
      2 << 5,
    ];

    listOfThreeBits.forEach((threeBits) => {
      data.appendBits(new Bits([threeBits], 3));
    });

    expect(data.bitCount).toBe(18);
    expect(data.bytes).toEqual([0b11000001, 0b11011110, 0b10000000]);
  });

  it('append 3 bits each time, and with bit limit', () => {
    const data = new Bits([0b11000000], 6, 16);
    const listOfThreeBits = [
      3 << 5,
      5 << 5,
      7 << 5,
      2 << 5,
    ];

    listOfThreeBits.forEach((threeBits) => {
      data.appendBits(new Bits([threeBits], 3));
    });

    expect(data.bitCount).toBe(18);
    expect(data.bytes).toEqual([0b11000001, 0b11011110]);
  });
});
