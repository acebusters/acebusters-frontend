/**
* Created by jzobro 20170519
*/
import React from 'react';

import {
  TimerBackground,
  TimerBar,
  TimerWrapper,
} from './styles';

const timerDisplayColor = (timerProgress) => {
  if (timerProgress >= 60) return 'active';
  if (timerProgress >= 30) return 'warning';
  if (timerProgress >= 0) return 'danger';
  return 'active';
};

const SeatTimer = ({ timeLeft }) => (
  <TimerWrapper>
    <TimerBackground>
      <TimerBar
        type={timerDisplayColor(timeLeft)}
        width={`${timeLeft}%`}
      />
    </TimerBackground>
  </TimerWrapper>
);

SeatTimer.propTypes = {
  timeLeft: React.PropTypes.number,
};

export default SeatTimer;
