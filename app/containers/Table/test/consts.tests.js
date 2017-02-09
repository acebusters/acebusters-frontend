/**
 * Created by helge on 27.01.17.
 */


// secretSeed: 'rural tent test net drip fatigue uncle action repeat couple lawn rival'
export const PLAYER1 = {
  address: '0x6d2f2c0fa568243d2def3e999a791a6df45d816e',
  key: '0x2e39143576f97f6ecd7439a0678f330d7144110cdc58b6476687cc243d7753ca',
};

export const PLAYER2 = {
  address: '0x1c5a1730ffc44ac21700bb85bf0ceefd12ce71d7',
  key: '0x99e69145c6e7f44ba04d579faac9ef4ce5e942dc02b96a9d42b5fcb03e508729',
};

export const PLAYER3 = {
  address: '0xdd7acad75b52bd206777a36bc41a3b65ad1c44fc',
  key: '0x33de976dfb8bdf2dc3115801e514b902c4c913c351b6549947758a8b9d981722',
};

export const PLAYER4 = {
  address: '0x0dfbfdf730c7d3612cf605e6629be369aa4eceeb',
  key: '0xa803ed744543e69b5e4816c5fc7539427a2928e78d729c87712f180fae52fcc9',
};

export const ABI = {
  ABI_BET: [{ name: 'bet', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_ALL_IN: [{ name: 'allIn', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_FOLD: [{ name: 'fold', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_SIT_OUT: [{ name: 'sitOut', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],

  ABI_CHECK_FLOP: [{ name: 'checkFlop', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_CHECK_TURN: [{ name: 'checkTurn', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_CHECK_RIVER: [{ name: 'checkRiver', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],

  ABI_SHOW: [{ name: 'show', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }] }],
  ABI_DIST: [{ name: 'distribution', type: 'function', inputs: [{ type: 'uint' }, { type: 'uint' }, { type: 'bytes32[]' }] }],
};
