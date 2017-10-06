import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import SeatTimer from './SeatTimer';
import SitoutTimer from './SitoutTimer';

import { StatusWrapper, StatusActionStyle } from './styles';

const StatusAction = ({
  showStatus,
  sitout,
  timeLeft,
  pos,
  whosTurn,
  wasMostRecentAction,
}) => {
  // if seat's turn for action, show timer for action
  if (whosTurn === pos) {
    if (timeLeft >= 0) return <SeatTimer timeLeft={timeLeft} />;
  }

  // if seat is in sitout, show the sitout timer
  if (typeof sitout === 'number' && sitout >= 0) return <SitoutTimer sitout={sitout} />;

  // if seat has a status, show action status
  if (!isEmpty(showStatus)) {
    return (
      <StatusWrapper>
        <StatusActionStyle
          name="status-action-style"
          type={showStatus.style}
          recent={wasMostRecentAction}
        >
          {showStatus.msg}
        </StatusActionStyle>
      </StatusWrapper>
    );
  }

  // else show nothing
  return null;
};
StatusAction.propTypes = {
  pos: PropTypes.number,
  showStatus: PropTypes.object,
  sitout: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  timeLeft: PropTypes.number,
  wasMostRecentAction: PropTypes.bool,
  whosTurn: PropTypes.number,
};

export default StatusAction;
