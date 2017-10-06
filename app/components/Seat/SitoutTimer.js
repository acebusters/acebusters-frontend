import React from 'react';
// import PropTypes from 'prop-types';

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
  // sitout: PropTypes.number,
};

export default SitoutTimer;
