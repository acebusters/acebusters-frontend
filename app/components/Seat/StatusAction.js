/**
* Created by jzobro 20170520
*/
import React from 'react';
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
  if (sitout >= 0) return <SitoutTimer sitout={sitout} />;

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
  pos: React.PropTypes.number,
  showStatus: React.PropTypes.object,
  sitout: React.PropTypes.number,
  timeLeft: React.PropTypes.number,
  wasMostRecentAction: React.PropTypes.bool,
  whosTurn: React.PropTypes.number,
};

export default StatusAction;
