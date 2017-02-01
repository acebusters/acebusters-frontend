import React from 'react';
import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import LoginPage from '../index';

const store = createStore(
  (state = fromJS({ account: { accountState: {}, loggedIn: true } })) => state
);

describe('<LoginPage />', () => {
  it('should render the Login Page', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <LoginPage store={store} />
      </IntlProvider>
    );
    expect(renderedComponent.find('h2').length).toEqual(1);
  });
});
