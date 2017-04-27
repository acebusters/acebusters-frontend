/* eslint no-multi-spaces: "off", key-spacing: "off" */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import MouseEntropy from '../index';

describe('<MouseEntropy />', () => {
  it('onFinished triggered', () => {
    const onFinish = sinon.spy();
    const wrapper  = mount(
      <MouseEntropy totalBits={10} width="200px" height="200px" sampleRate={-1} onFinish={onFinish} />
    );

    for (let i = 0; i < 100; i += 1) {
      wrapper.childAt(0).simulate('mousemove', {
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: Math.floor(Math.random() * 200),
        clientY: Math.floor(Math.random() * 200),
      });
    }

    expect(onFinish).toHaveProperty('callCount', 1);
  });
});
