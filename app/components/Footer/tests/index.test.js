import React from 'react';
import { shallow } from 'enzyme';

import Footer, { A } from '../index';

describe('<Footer />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent.contains(
      <A href="http://www.acebusters.com/terms_of_use" target="_blank">Terms of Use</A>
    )).toBe(true);
  });

  it('should render icons', () => {
    const renderedComponent = shallow(<Footer />);
    expect(renderedComponent.find('.fa').length).toBe(4);
  });
});
