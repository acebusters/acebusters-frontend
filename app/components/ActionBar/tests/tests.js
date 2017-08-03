import { fromJS } from 'immutable';
import sinon from 'sinon';
import {
  BET_SET,
  CHECK,
} from '../../../containers/ActionBar/actions';

export const combine = (describe, it) => `${describe}, ${it}`;

export const baseProps = fromJS({
  params: {
    tableAddr: '0x123',
  },
  active: false,
  amount: 0,
  amountToCall: 0,
  buttonActive: '',
  disabled: false,
  callAmount: 0,
  minRaise: 0,
  mode: '',
  myStack: 2000,
  sliderOpen: false,
  turnComplete: false,
  visible: false,
  setActionBarButtonActive: sinon.spy(),
  handleClickButton: sinon.spy(),
  handleFold: sinon.spy(),
  handleCheck: sinon.spy(),
  handleCall: sinon.spy(),
  handleBet: sinon.spy(),
  updateAmount: sinon.spy(),
  handleAllIn: sinon.spy(),
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
    active: false,
    visible: true,
  }).toJS(),
};

export const atTable2 = {
  describe: 'when at table, and is Turn',
  it: 'actionBar should render, and be clickable',
  props: baseProps.merge({
    active: true,
    visible: true,
    buttonActive: CHECK,
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
    mode: BET_SET,
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
    mode: BET_SET,
    minRaise: 1900,
    myStack: 2000,
  }).toJS(),
};
