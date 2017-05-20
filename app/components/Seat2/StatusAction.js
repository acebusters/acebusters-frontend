/**
* Created by jzobro 20170520
*/
import React from 'react';

import { StatusWrapper, StatusActionStyle } from './styles';

const statusType = (lastAction) => {
  if (lastAction === 'call') return 'success';
  if (lastAction === 'check') return 'success';
  if (lastAction === 'all-in') return 'warning';
  if (lastAction === 'winner') return 'warning';
  if (lastAction === 'raise') return 'danger';
  if (lastAction === 'bet') return 'danger';
  return 'success';
};

const StatusAction = ({ lastAction, showStatus }) => (
  <StatusWrapper>
    <StatusActionStyle type={statusType(lastAction)} recent={showStatus}>
      {lastAction}
    </StatusActionStyle>
  </StatusWrapper>
);
StatusAction.propTypes = {
  lastAction: React.PropTypes.string,
  showStatus: React.PropTypes.bool,
};

export default StatusAction;
