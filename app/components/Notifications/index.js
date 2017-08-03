import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

const Notifications = (props) => {
  const { notifications } = props;

  return (
    <div>
      {notifications.length !== 0 &&
        notifications.map(
          (item, i) => <Notification key={i} {...item} {...props} />,
        )
      }
    </div>
  );
};
Notifications.propTypes = {
  notifications: PropTypes.array,
};

export default Notifications;
