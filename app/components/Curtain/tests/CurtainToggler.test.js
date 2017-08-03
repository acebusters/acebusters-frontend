import React from 'react';
import { shallow } from 'enzyme';
import CurtainToggler from '../CurtainToggler';

describe('CurtainToggler', () => {
  it('should display left-carret when open', () => {
    const el = shallow(<CurtainToggler isOpen />);
    expect(el.find('.fa-chevron-left').length).toBe(1);
  });
  it('should display chat icon and text when closed', () => {
    const el = shallow(<CurtainToggler isOpen={false} />);
    expect(el.find('.fa-comments-o').length).toBe(1);
    expect(el.find({ name: 'curtain-toggler' }).render().text()).toBe('Chat');
  });
});
