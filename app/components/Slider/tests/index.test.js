import React from 'react';
import { shallow } from 'enzyme';
import Slider from '../index';

import { props } from './stories';

describe('Slider defaults', () => {
  const newProps = props.toJS();
  const el = shallow(<Slider {...newProps} />);
  it('generates marks with last mark === myStack', () => {
    const marks = {
      100: '',
      200: '',
      300: '',
      332: '',
    };
    expect(el.find('ComponentEnhancer').props().marks).toEqual(marks);
  });
});
