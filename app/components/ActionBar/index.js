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
  } = props;
  if (visible) {
    return (
      <ActionBarWrapper
        active={active}
        disabled={disabled}
        name="action-bar-wrapper"
      >

        <FlagAmountCall {...props} />
        <FlagAmountBet {...props} />
        <FlagContainer active={active} name="flag-container">
          <FlagButton type={0.25} {...props} />
          <FlagButton type={0.50} {...props} />
          <FlagButton type={1.00} {...props} />
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
  }
  return null;
};

ActionBar.propTypes = {
  visible: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  sliderOpen: PropTypes.bool,
};

export default ActionBar;
