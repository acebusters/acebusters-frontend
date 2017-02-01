import React from 'react';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <Header account={{ account: { loggedIn: true } }} />
    );
    expect(renderedComponent.find('div').length).toEqual(2);
  });
});
