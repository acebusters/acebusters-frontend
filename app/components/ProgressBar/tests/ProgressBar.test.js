import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import ProgressBar from '../ProgressBar';
import Wrapper from '../Wrapper';
import Percent from '../Percent';

let clock = null;

describe('<ProgressBar />', () => {
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock = sinon.restore();
  });

  it('should initially render hidden progress bar', () => {
    const renderedComponent = shallow(
      <ProgressBar />
    );
    expect(renderedComponent.find(Wrapper).length).toEqual(1);
  });

  it('should render render horizontal progress bar', () => {
    const renderedComponent = shallow(
      <ProgressBar />
    );
    expect(renderedComponent.find(Percent).length).toEqual(1);
  });

  it('should set state.progress as props.progress', () => {
    const expected = 50;
    const renderedComponent = mount(
      <ProgressBar progress={expected} />
    );
    expect(renderedComponent.state().progress).toEqual(expected);
  });

  it('should call componentDidMount', () => {
    sinon.spy(ProgressBar.prototype, 'componentDidMount');
    const renderedComponent = mount( // eslint-disable-line
      <ProgressBar progress={0} />
    );
    expect(ProgressBar.prototype.componentDidMount.calledOnce).toEqual(true);
    ProgressBar.prototype.componentDidMount.restore();
  });

  it('should call componentWillReceiveProps', () => {
    sinon.spy(ProgressBar.prototype, 'componentWillReceiveProps');
    const renderedComponent = mount( // eslint-disable-line
      <ProgressBar progress={0} />
    );
    renderedComponent.setProps({ percent: 50 });
    expect(ProgressBar.prototype.componentWillReceiveProps.calledOnce).toEqual(true);
    ProgressBar.prototype.componentWillReceiveProps.restore();
  });

  it('should unset ProgressBar.state.timer after getting new props', () => {
    const renderedComponent = mount( // eslint-disable-line
      <ProgressBar progress={-3000} />
    );
    const inst = renderedComponent.instance();

    clock.tick(1000);
    expect(renderedComponent.state().timer).not.toBeNull();
    inst.componentWillReceiveProps({ percent: 50 });
    expect(renderedComponent.state().timer).toBeNull();
  });

  it('should set state to 0 after new route mounts', () => {
    const renderedComponent = mount(
      <ProgressBar percent={0} updateProgress={(noop) => noop} />
    );
    renderedComponent.setProps({ percent: 100 });
    clock.tick(501);
    expect(renderedComponent.state().progress).toEqual(0);
  });

  it('should call componentWillUnmount', () => {
    sinon.spy(ProgressBar.prototype, 'componentWillUnmount');
    const renderedComponent = mount( // eslint-disable-line
      <ProgressBar percent={0} updateProgress={(noop) => noop} />
    );
    renderedComponent.unmount();
    expect(ProgressBar.prototype.componentWillUnmount.calledOnce).toEqual(true);
    ProgressBar.prototype.componentWillUnmount.restore();
  });

  describe('increment progress', () => {
    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock = sinon.restore();
    });

    it('should start incrementing progress if props.progress < -10', () => {
      const initialPercent = -2000;
      const renderedComponent = mount(
        <ProgressBar progress={initialPercent} />
      );
      clock.tick(1000);
      expect(renderedComponent.state().progress).toBeGreaterThan(0);
    });

    it('should stop incrementing progress if props.progress >= 0', () => {
      const initialPercent = -2000;
      const renderedComponent = mount(
        <ProgressBar progress={initialPercent} />
      );
      clock.tick(1000);
      expect(renderedComponent.state().progress).toBeGreaterThan(0);
      renderedComponent.setProps({ progress: 0 });
      expect(renderedComponent.state().progress).toEqual(0);
    });
  });
});
