/* eslint no-multi-spaces: "off", key-spacing: "off", no-bitwise: "off" */

const BYTE_LENGTH = 8;

export default class Bits {
  constructor(bytes, bitCount, bitLimit = Infinity) {
    this.bytes    = bytes;
    this.bitCount = bitCount;
    this.bitLimit = bitLimit;
  }

  stringify() {
    const str = this.bytes.map((byte) => String.fromCharCode(byte))
                          .join('');

    return btoa(str);
  }

  appendBits(bitData) {
    const cutByte = (byte, highBitCount) => [
      byte >> (BYTE_LENGTH - highBitCount),
      byte & ((2 ** (BYTE_LENGTH - highBitCount)) - 1),
    ];

    let newIndex      = 0;
    let newBitCount   = 0;
    const maxBitCount = bitData.bitCount;
    const newBytes    = bitData.bytes;

    let oldIndex;
    let oldCurCount = this.bitCount;
    const oldLimit  = this.bitLimit;
    const oldBytes  = this.bytes;
    const oldCount  = this.bitCount;
    const offset    = BYTE_LENGTH - (oldCount % BYTE_LENGTH);

    if (oldBytes.length === 0) {
      oldIndex = 0;
    } else {
      oldIndex = offset === BYTE_LENGTH ? oldBytes.length : (oldBytes.length - 1);
    }

    while (newIndex < newBytes.length) {
      const [high, low]   = cutByte(newBytes[newIndex], offset);

      oldBytes[oldIndex]  = (oldBytes[oldIndex] || 0) + high;
      newBitCount += offset;
      oldCurCount += offset;

      if (oldCurCount < oldLimit && newBitCount < maxBitCount) {
        oldBytes[oldIndex + 1] = (oldBytes[oldIndex + 1] || 0) + (low << offset);
        newBitCount += BYTE_LENGTH - offset;
        oldCurCount += BYTE_LENGTH - offset;
      }

      oldIndex += 1;
      newIndex += 1;
    }

    this.bytes    = oldBytes;
    this.bitCount = oldCount + maxBitCount;

    return this;
  }
}
