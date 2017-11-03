import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { notifyRemove } from './actions';
import { selectNotifications } from './selectors';
import { makeSelectLoggedIn } from '../AccountProvider/selectors';

import Notifications from '../../components/Notifications';

const NotificationsContainer = ({ location: { pathname }, ...props }) => {
  const showNotifications = pathname.match(/table|lobby|dashboard|login/);
  const isTable = pathname.match('table');
  if (showNotifications) {
    return <Notifications isNotTable={!isTable} {...props} />;
  }
  return null;
};
NotificationsContainer.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
};

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications(),
  loggedIn: makeSelectLoggedIn(),
});

export default connect(
  mapStateToProps,
  { notifyRemove },
)(NotificationsContainer);
