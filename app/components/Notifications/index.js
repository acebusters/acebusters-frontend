import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

const Notifications = (props) => (
  <div>
    {props.notifications.map(
      (item, i) => <Notification key={i} {...item} {...props} />,
    )}
  </div>
);
Notifications.propTypes = {
  notifications: PropTypes.array,
};

export default Notifications;
