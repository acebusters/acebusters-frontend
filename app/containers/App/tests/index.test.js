import React from 'react';
import { shallow } from 'enzyme';

import Header from 'components/Header';
import { App } from '../index';

describe('<App />', () => {
  it('should render the header', () => {
    const renderedComponent = shallow(
      <App account={{ account: { loggedIn: true } }} />
    );
    expect(renderedComponent.find(Header).length).toBe(1);
  });

  it('should render its children', () => {
    const children = (<h1>Test</h1>);
    const renderedComponent = shallow(
      <App account={{ account: { loggedIn: true } }} >
        {children}
      </App>
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});
