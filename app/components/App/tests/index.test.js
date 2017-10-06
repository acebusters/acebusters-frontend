import React from 'react';
import { shallow } from 'enzyme';
import Footer from 'components/Footer';
import Header from 'containers/Header';
import GoogleTagManager from 'containers/GTM';
import Modal from 'containers/Modal';
import Notifications from 'containers/Notifications';
import App from '../index';

const defaultProps = {
  notifications: [],
  isLoading: false,
};

describe('is not table', () => {
  const props = {
    ...defaultProps,
    location: { pathname: 'lobby' },
    isLoading: true,
  };
  const el = shallow(<App {...props} />);
  it('should render loading widgets', () => {
    expect(el.find(Header).length).toBe(1);
    expect(el.find(GoogleTagManager).length).toBe(1);
    expect(el.find(Footer).length).toBe(1);
    expect(el.find(Modal).length).toBe(1);
    expect(el.find(Notifications).length).toBe(1);
  });
});

describe('is table', () => {
  const props = { ...defaultProps, location: { pathname: 'table' } };
  const el = shallow(<App {...props} />);
  it('should not render', () => {
    expect(el.find(Header).length).toBe(0);
    expect(el.find(Footer).length).toBe(0);
  });
  it('should render', () => {
    expect(el.find(GoogleTagManager).length).toBe(1);
    expect(el.find(Modal).length).toBe(1);
    expect(el.find(Notifications).length).toBe(1);
  });
});
