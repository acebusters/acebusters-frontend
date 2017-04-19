/**
 * Testing our Button component
 */

import React from 'react';
import { shallow } from 'enzyme';
import { ActionBar } from '../index';
import { ActionButton } from '../../../components/ActionBar';

describe('ActionBar', () => {
  it('should not render in waiting or dealing', () => {
    const props = {
      state: 'waiting',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
    };
    let actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.children().length).toBe(0);
    props.state = 'dealing';
    actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.children().length).toBe(0);
  });

  it('should render in flop', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.children().length).toBeGreaterThan(0);
  });

  it('should not render in flop when its not my turn', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: false,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.children().length).toBe(0);
  });

  it('should render fold button when amountToCall is greater than 0', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      amountToCall: 1000,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.find(ActionButton).last().props().text).toBe('FOLD');
  });

  it('should not render fold button when amountToCall is 0', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      amountToCall: 0,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.find(ActionButton).length).toBe(2);
  });

  it('should render the BET Button with correct betting amount', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      minRaise: 2000,
      amountToCall: 0,
      myStack: 10000,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    actionBar.instance().componentWillReceiveProps(props);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('BET 2000');
  });

  it('should render the RAISE Button with correct min amount', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      minRaise: 5000,
      amountToCall: 1000,
      myStack: 10000,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    actionBar.instance().componentWillReceiveProps(props);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('RAISE 5000');
  });

  it('should set Bet to all in amount', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      myStack: 1750,
      amountToCall: 0,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    actionBar.instance().updateAmount(2000);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('BET 1750');
  });

  it('should render the Check Button when amount to call is 0', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      amountToCall: 0,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.find(ActionButton).nodes[1].props.text).toEqual('CHECK');
  });

  it('should render the Call Button when amount to call is greater 0', () => {
    const props = {
      state: 'preflop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      callAmount: 1000,
      amountToCall: 1000,
      myStack: 2000,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.find(ActionButton).nodes[1].props.text).toEqual('CALL 1000');
  });

  it('should not render the Raise Button if amount to call is bigger than my stack', () => {
    const props = {
      state: 'preflop',
      params: {
        tableAddr: '0x123',
      },
      isMyTurn: true,
      callAmount: 800,
      amountToCall: 1000,
      myStack: 800,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    expect(actionBar.find(ActionButton).nodes[0].props.text).toEqual('CALL 800');
    expect(actionBar.find(ActionButton).nodes.length).toEqual(2);
  });

  it('should disappear after action was taken', () => {
    const props = {
      state: 'flop',
      params: {
        tableAddr: '0x123',
        handId: 1,
      },
      isMyTurn: true,
      amountToCall: 1000,
    };
    const actionBar = shallow(
      <ActionBar {...props} />
    );
    actionBar.instance().setActive(false);
    expect(actionBar.children().length).toBe(0);
  });
});

