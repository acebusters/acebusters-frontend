import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { notifyRemove } from './actions';
import { selectNotifications } from './selectors';
import { makeSelectLoggedIn } from '../AccountProvider/selectors';

import Notifications from '../../components/Notifications';

const NotificationsContainer = (props) => (
  <Notifications {...props} />
);

const mapDispatchToProps = (dispatch) => ({
  notifyRemove: (txId) => dispatch(notifyRemove(txId)),
});

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications(),
  loggedIn: makeSelectLoggedIn(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsContainer);
