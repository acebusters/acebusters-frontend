export const combine = (describe, it) => `${describe}, ${it}`;

export default [{
  describe: '[0] during table "waiting"',
  props: {
    visible: false,
    state: 'waiting',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
  },
  it: 'actionBar should not render',
}, {
  describe: '[1] during table "dealing"',
  props: {
    visible: false,
    state: 'dealing',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
  },
  it: 'actionBar should not render',
}, {
  describe: '[2] during table "flop"',
  props: {
    amount: 100,
    visible: true,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
  },
  it: 'actionBar should render',
}, {
  describe: '[3] during table "flop" if isMyTurn is false',
  props: {
    visible: false,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: false,
  },
  it: 'actionBar should not render',
}, {
  describe: '[4] when amountToCall > 0',
  props: {
    visible: true,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    amountToCall: 1000,
    callAmount: 1000,
    amount: 200,
    myStack: 2000,
  },
  it: 'should render fold button',
}, {
  describe: '[5] amountToCall is 0',
  props: {
    visible: true,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    amount: 200,
    myStack: 2000,
    isMyTurn: true,
    amountToCall: 0,
  },
  it: 'should not render fold button',
}, {
  describe: '[6] the correct betting amount',
  props: {
    visible: true,
    amount: 2000,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    minRaise: 2000,
    amountToCall: 0,
    myStack: 10000,
  },
  it: 'should render BET button',
}, {
  describe: '[7] RAISE button min amount',
  props: {
    visible: true,
    amount: 5000,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    minRaise: 5000,
    amountToCall: 1000,
    callAmount: 1000,
    myStack: 10000,
  },
  it: 'should render with correct min amount',
}, {
  describe: '[8] if all-in amount',
  props: {
    visible: true,
    amount: 1750,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    myStack: 1750,
    amountToCall: 0,
  },
  it: 'should set BET to all-in amount',
}, {
  describe: '[9] when amount to call === 0',
  props: {
    amount: 100,
    visible: true,
    state: 'flop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    amountToCall: 0,
  },
  it: 'should render the CHECK button',
}, {
  describe: '[10] when amount to call > 0',
  props: {
    visible: true,
    amount: 1000,
    state: 'preflop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    callAmount: 1000,
    amountToCall: 1000,
    myStack: 2000,
  },
  it: 'should render the CALL button',
}, {
  describe: '[11] if amount to call > myStack',
  props: {
    visible: true,
    amount: 800,
    state: 'preflop',
    params: {
      tableAddr: '0x123',
    },
    isMyTurn: true,
    callAmount: 800,
    amountToCall: 1000,
    myStack: 800,
  },
  it: 'should not render the RAISE button',
}, {
  describe: '[12] after action was taken',
  props: {
    visible: false,
    state: 'flop',
    params: {
      tableAddr: '0x123',
      handId: 1,
    },
    isMyTurn: true,
    amountToCall: 1000,
  },
  it: 'actionBar should dissappear',
}];
