import React from 'react';
import { shallow } from 'enzyme';
import Pot, { Chip } from '../index';

describe('calculateChipStacks()', () => {
  it('Should calculate the right amount of chips', () => {
    const renderedComponent = shallow(
      <Pot potSize={55010000000000000} right="0%" left="0%" />
    );
    expect(renderedComponent.find(Chip).length).toBe(5);
  });
});
