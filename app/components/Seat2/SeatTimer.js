/**
* Created by jzobro 20170519
*/
import React from 'react';

import {
  TimerBackground,
  TimerBar,
  TimerWrapper,
} from './styles';

const timerDisplayType = (timerType, timerProgress) => {
  if (timerType === 'sitout') return 'info';
  if (timerProgress >= 0.6) return 'active';
  if (timerProgress >= 0.3) return 'warning';
  if (timerProgress >= 0) return 'danger';
  return 'active';
};

const timerWidth = (timerProgress) => {
  const percent = timerProgress * 100;
  return `${percent}%`;
};

const SeatTimer = ({ timerProgress, timerType }) => (
  <TimerWrapper>
    <TimerBackground>
      <TimerBar
        type={timerDisplayType(timerType, timerProgress)}
        width={timerWidth(timerProgress)}
      />
    </TimerBackground>
  </TimerWrapper>
);

SeatTimer.propTypes = {
  timerProgress: React.PropTypes.number,
  timerType: React.PropTypes.string, // sitout or action
};

export default SeatTimer;
