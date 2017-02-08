import React from 'react';
import { createStore } from 'redux';
import { fromJS } from 'immutable';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import RegisterPage from '../index';

const store = createStore(
  (state = fromJS({ account: { formState: {}, loggedIn: false } })) => state
);

describe('<RegisterPage />', () => {
  it('should render the Register Page', () => {
    const renderedComponent = mount(
      <IntlProvider locale="en">
        <RegisterPage store={store} />
      </IntlProvider>
    );
    expect(renderedComponent.find('h2').length).toEqual(1);
  });
});
