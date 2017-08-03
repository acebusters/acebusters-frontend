/**
* Created by jzobro 20170519
*/
import React from 'react';

import {
  TimerBackground,
  TimerBar,
  TimerWrapper,
} from './styles';

const SitoutTimer = () => (
  <TimerWrapper>
    <TimerBackground>
      <TimerBar
        type="info"
        width={`${100}%`}
      />
    </TimerBackground>
  </TimerWrapper>
);

SitoutTimer.propTypes = {
  // sitout: React.PropTypes.number,
};

export default SitoutTimer;
