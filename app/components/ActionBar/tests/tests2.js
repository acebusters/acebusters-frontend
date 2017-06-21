import { fromJS } from 'immutable';
export const combine = (describe, it) => `${describe}, ${it}`;

export const baseProps = fromJS({
  params: {
    tableAddr: '0x123',
  },
  active: false,
  // amount: 0,
  amountToCall: 0,
  callAmount: 0,
  minRaise: 0,
  mode: '',
  myStack: 2000,
  sliderOpen: false,
  turnComplete: false,
  visible: false,
  setActionBarBetSlider: () => {},
  handleFold: () => {},
  handleCheck: () => {},
  handleCall: () => {},
  handleBet: () => {},
  updateAmount: () => {},
  handleAllIn: () => {},
});

export const atTable0 = {
  describe: 'when not at table',
  it: 'actionBar should not render',
  props: baseProps.toJS(),
};

export const atTable1 = {
  describe: 'when at table, and not Turn',
  it: 'actionBar should render as disabled, buttons should not be clickable',
  props: baseProps.merge({
    active: true,
    visible: true,
  }).toJS(),
};

export const atTable2 = {
  describe: 'when at table, and is Turn',
  it: 'actionBar should render',
  props: baseProps.merge({
    active: true,
    visible: true,
  }).toJS(),
};

export const amountToCheck = {
  describe: 'when amountToCall === 0',
  it: 'should render !fold, check, bet button',
  props: baseProps.merge({
    active: true,
    amountToCall: 0,
    visible: true,
  }).toJS(),
};

export const amountToCall0 = {
  describe: 'when amountToCall > 0',
  it: 'should render fold, call, raise button',
  props: baseProps.merge({
    active: true,
    amountToCall: 1000,
    callAmount: 1000,
    myStack: 2000,
    visible: true,
  }).toJS(),
};

export const amountToCall1 = {
  describe: 'when amountToCall > myStack',
  it: 'should render fold, !call, all-in button',
  props: baseProps.merge({
    active: true,
    amountToCall: 1000,
    callAmount: 800,
    myStack: 800,
    visible: true,
  }).toJS(),
};

export const minRaise0 = {
  describe: 'when amountToCall < myStack, but minRaise > myStack',
  it: 'should render fold, call, all-in button',
  props: baseProps.merge({
    active: true,
    amountToCall: 1000,
    callAmount: 1000,
    minRaise: 1500,
    myStack: 1200,
    visible: true,
  }).toJS(),
};

export const buttonBet0 = {
  describe: 'ButtonBet state is closed',
  it: 'should not show slider',
  props: baseProps.merge({
    active: true,
    amountToCall: 0,
    callAmount: 0,
    amount: 0,
    myStack: 2000,
    minRaise: 100,
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const buttonBet1 = {
  describe: 'ButtonBet state is open',
  it: 'should show slider',
  props: baseProps.merge({
    active: true,
    amount: 100,
    amountToCall: 0,
    callAmount: 0,
    myStack: 2000,
    minRaise: 100,
    mode: 'BET-SET',
    sliderOpen: true,
    visible: true,
  }).toJS(),
};

export const buttonRaise0 = {
  describe: 'ButtonRaise state is close',
  it: 'should not show slider',
  props: baseProps.merge({
    active: true,
    amount: 1000,
    amountToCall: 1000,
    callAmount: 1000,
    visible: true,
    sliderOpen: false,
    minRaise: 1900,
    myStack: 2000,
  }).toJS(),
};

export const buttonRaise1 = {
  describe: 'ButtonRaise state is open',
  it: 'should show slider',
  props: baseProps.merge({
    active: true,
    amount: 1900,
    amountToCall: 1000,
    callAmount: 1000,
    visible: true,
    sliderOpen: true,
    mode: 'RAISE-SET',
    minRaise: 1900,
    myStack: 2000,
  }).toJS(),
};

export const actionDispatchAllIn = {
  describe: 'player selects ALL-IN action',
  it: 'should highlight ALL-IN button',
  props: fromJS(amountToCall1.props).merge({
    active: true,
    mode: 'ALL-IN',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const actionDispatchBet = {
  describe: 'player selects BET action',
  it: 'should highlight BET button',
  props: baseProps.merge({
    active: true,
    mode: 'BET-CONFIRM',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const actionDispatchCall = {
  describe: 'player selects CALL action',
  it: 'should highlight CALL button',
  props: fromJS(amountToCall0.props).merge({
    active: true,
    mode: 'CALL',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const actionDispatchCheck = {
  describe: 'player selects CHECK action',
  it: 'should highlight CHECK button',
  props: fromJS(amountToCheck.props).merge({
    active: true,
    mode: 'CHECK',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const actionDispatchFold = {
  describe: 'player selects FOLD action',
  it: 'should highlight FOLD button',
  props: fromJS(amountToCall1.props).merge({
    active: true,
    mode: 'FOLD',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};

export const actionDispatchRaise = {
  describe: 'player selects RAISE action',
  it: 'should highlight RAISE button',
  props: baseProps.merge({
    active: true,
    mode: 'RAISE-CONFIRM',
    sliderOpen: false,
    visible: true,
  }).toJS(),
};
