/**
 * Created by helge on 24.08.16.
 */
import React from 'react';
import PropTypes from 'prop-types';

import FlagAmountBet from './FlagAmountBet';
import FlagAmountCall from './FlagAmountCall';
import FlagButton from './FlagButton';
import ControlBetRaise from './ControlBetRaise';
import ControlCheckCall from './ControlCheckCall';
import ControlFold from './ControlFold';
import Slider from '../Slider';

import {
  ActionBarWrapper,
  ControlPanel,
  ControlWrapper,
  FlagContainer,
} from './styles';

const ActionBar = (props) => {
  const {
    active,
    disabled,
    sliderOpen,
    visible,
    potSize,
    state,
    sb,
  } = props;
  if (!visible) {
    return false;
  }

  return (
    <ActionBarWrapper
      active={active}
      disabled={disabled}
      name="action-bar-wrapper"
    >

      <FlagAmountCall {...props} />
      <FlagAmountBet {...props} />
      <FlagContainer active={active} name="flag-container">
        {state === 'preflop' &&
          <FlagButton
            value={sb * 6}
            label="3BB"
            {...props}
          />
        }
        <FlagButton
          value={potSize * 0.25}
          label="1/4"
          {...props}
        />
        <FlagButton
          value={potSize * 0.5}
          label="1/2"
          {...props}
        />
        <FlagButton
          value={potSize}
          label="POT"
          {...props}
        />
      </FlagContainer>

      <ControlPanel name="control-panel-visible">
        <ControlWrapper sliderOpen={sliderOpen} >
          <ControlFold {...props} />
          <ControlCheckCall {...props} />
          <ControlBetRaise {...props} />
          {sliderOpen &&
            <Slider {...props} />
          }
        </ControlWrapper>
      </ControlPanel>

    </ActionBarWrapper>
  );
};

ActionBar.propTypes = {
  visible: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  sliderOpen: PropTypes.bool,
  potSize: PropTypes.number,
  state: PropTypes.string,
  sb: PropTypes.number,
};

export default ActionBar;
