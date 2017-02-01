import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { createStore } from 'redux';
import { fromJS } from 'immutable';

import LoginPage from '../index';

const store = createStore(
  (state = fromJS({ account: {} })) => state
);

describe('<LoginPage />', () => {
  it('should render the Login Page', () => {
    const renderedComponent = shallow(
      <LoginPage store={store} />
    );
    expect(renderedComponent.contains(
      <h2 className="form-page__form-heading">
        <FormattedMessage
          id="app.containers.LoginPage.header"
          defaultMessage={'Login'}
        />
      </h2>)).toEqual(true);
  });
});
