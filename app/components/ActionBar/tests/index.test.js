/**
 * Testing our Button component
 */

import React from 'react';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import ActionBar from '../index';

import * as tests from './tests';

describe('atTable', () => {
  describe(tests.atTable0.describe, () => {
    it(tests.atTable0.it, () => {
      const actionBar = shallow(
        <ActionBar {...tests.atTable0.props} />
      );
      expect(actionBar.find('ActionBarComponent').length).toBe(0);
    });
  });

  describe(tests.atTable1.describe, () => {
    const actionBar = shallow(
      <ActionBar {...tests.atTable1.props} />
    );
    it(tests.atTable1.it, () => {
      expect(actionBar.find({ name: 'action-bar-wrapper' }).length).toBe(1);
    });
    it('should not be clickable', () => {
      actionBar.find('ControlCheckCall').simulate('click');
      sinon.assert.notCalled(
        tests.atTable1.props.handleCheck
      );
    });
  });

  describe(tests.atTable2.describe, () => {
    const actionBar = mount(
      <ActionBar {...tests.atTable2.props} />
    );
    it(tests.atTable2.it, () => {
      expect(actionBar.find({ name: 'action-bar-wrapper' }).length).toBe(1);
    });
    it('should render as expected', () => {
      expect(actionBar.find('ControlCheckCall').length).toBe(1);
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
    });
    it('should be clickable', () => {
      // simulating mouseup here, as the modified props
      // already simulate a mouseDown by setting the
      // 'buttonActive' prop to 'CHECK' in this case
      actionBar.find('ControlCheckCall').simulate('mouseUp');
      sinon.assert.calledOnce(
        tests.atTable2.props.handleCheck
      );
    });
  });
});

describe(tests.amountToCheck.describe, () => {
  const actionBar = mount(<ActionBar {...tests.amountToCheck.props} />);
  it(tests.amountToCheck.it, () => {
    expect(actionBar.find({ name: 'button-blank' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-check' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-bet' }).length).toEqual(1);
  });
});

describe(tests.amountToCall0.describe, () => {
  it(tests.amountToCall0.it, () => {
    const actionBar = mount(
      <ActionBar {...tests.amountToCall0.props} />
    );
    expect(actionBar.find({ name: 'button-fold' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-call' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-raise' }).length).toEqual(1);
  });
});

describe(tests.amountToCall1.describe, () => {
  it(tests.amountToCall1.it, () => {
    const actionBar = mount(
      <ActionBar {...tests.amountToCall1.props} />
    );
    expect(actionBar.find({ name: 'button-fold' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-call' }).length).toEqual(0);
    expect(actionBar.find({ name: 'button-blank' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-all-in' }).length).toEqual(1);
  });
});

describe(tests.minRaise0.describe, () => {
  it(tests.minRaise0.it, () => {
    const actionBar = mount(
      <ActionBar {...tests.minRaise0.props} />
    );
    expect(actionBar.find({ name: 'button-fold' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-call' }).length).toEqual(1);
    expect(actionBar.find({ name: 'button-blank' }).length).toEqual(0);
    expect(actionBar.find({ name: 'button-all-in' }).length).toEqual(1);
  });
});

describe('bet slider', () => {
  describe(tests.buttonBet0.describe, () => {
    it(tests.buttonBet0.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.buttonBet0.props} />
      );
      expect(actionBar.find({ name: 'slider-wrapper' }).length).toEqual(0);
    });
  });

  describe(tests.buttonBet1.describe, () => {
    it(tests.buttonBet1.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.buttonBet1.props} />
      );
      expect(actionBar.find({ name: 'slider-wrapper' }).length).toEqual(1);
    });
  });
});

describe('raise slider', () => {
  describe(tests.buttonRaise0.describe, () => {
    it(tests.buttonRaise0.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.buttonRaise0.props} />
      );
      expect(actionBar.find({ name: 'slider-wrapper' }).length).toEqual(0);
    });
  });

  describe(tests.buttonRaise1.describe, () => {
    it(tests.buttonRaise1.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.buttonRaise1.props} />
      );
      expect(actionBar.find({ name: 'slider-wrapper' }).length).toEqual(1);
    });
  });
});

describe('dispatch player actions', () => {
  describe(tests.actionDispatchAllIn.describe, () => {
    it(tests.actionDispatchAllIn.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchAllIn.props} />
      );
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
      actionBar.find('ControlBetRaise').simulate('mouseUp');
      sinon.assert.calledOnce(
        tests.actionDispatchAllIn.props.handleAllIn
      );
    });
  });
  describe(tests.actionDispatchCall.describe, () => {
    it(tests.actionDispatchCall.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchCall.props} />
      );
      expect(actionBar.find('ControlCheckCall').length).toBe(1);
      actionBar.find('ControlCheckCall').simulate('mouseUp');
      sinon.assert.calledOnce(
        tests.actionDispatchCall.props.handleCall
      );
    });
  });
  describe(tests.actionDispatchFold.describe, () => {
    it(tests.actionDispatchFold.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchFold.props} />
      );
      expect(actionBar.find('ControlFold').length).toBe(1);
      actionBar.find('ControlFold').simulate('mouseUp');
      sinon.assert.calledOnce(
        tests.actionDispatchFold.props.handleFold
      );
    });
  });
});

describe('Button Bet actions', () => {
  describe(tests.actionDispatchBet0.describe, () => {
    it(tests.actionDispatchBet0.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchBet0.props} />
      );
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
      expect(actionBar.find({ name: 'button-bet' }).length).toBe(1);
      const spy = tests.actionDispatchBet0.props.setActionBarBetSlider;
      sinon.assert.callCount(spy, 0);
      actionBar.find('ControlBetRaise').simulate('mouseUp');
      sinon.assert.callCount(spy, 2); // once by default
    });
  });
  describe(tests.actionDispatchBet1.describe, () => {
    it(tests.actionDispatchBet1.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchBet1.props} />
      );
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
      expect(actionBar.find({ name: 'button-bet-confirm' }).length).toBe(1);
      const spy = tests.actionDispatchBet1.props.setActionBarBetSlider;
      actionBar.find('ControlBetRaise').simulate('mouseUp');
      sinon.assert.callCount(spy, 1); // once by default
      const spy1 = tests.actionDispatchBet1.props.handleBet;
      sinon.assert.calledOnce(spy1);
    });
  });
});

describe('Button Raise actions', () => {
  describe(tests.actionDispatchRaise0.describe, () => {
    it(tests.actionDispatchRaise0.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchRaise0.props} />
      );
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
      expect(actionBar.find({ name: 'button-raise' }).length).toBe(1);
      const spy = tests.actionDispatchRaise0.props.setActionBarBetSlider;
      sinon.assert.callCount(spy, 0);
      actionBar.find('ControlBetRaise').simulate('mouseUp');
      sinon.assert.callCount(spy, 2); // once by default
    });
  });
  describe(tests.actionDispatchRaise1.describe, () => {
    it(tests.actionDispatchRaise1.it, () => {
      const actionBar = mount(
        <ActionBar {...tests.actionDispatchRaise1.props} />
      );
      expect(actionBar.find('ControlBetRaise').length).toBe(1);
      expect(actionBar.find({ name: 'button-raise-confirm' }).length).toBe(1);
      const spy = tests.actionDispatchRaise1.props.setActionBarBetSlider;
      actionBar.find('ControlBetRaise').simulate('mouseUp');
      sinon.assert.callCount(spy, 1); // once by default
      const spy1 = tests.actionDispatchRaise1.props.handleBet;
      sinon.assert.calledOnce(spy1);
    });
  });
});
