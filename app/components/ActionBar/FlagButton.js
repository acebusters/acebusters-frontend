import React from 'react';
import PropTypes from 'prop-types';

import { FlagButtonWrapper } from './styles';

const FlagButton = ({
  potSize,
  minRaise,
  sliderOpen,
  type,
  updateAmount,
}) => {
  const textType = () => {
    if (type === 0.25) return '1/4';
    if (type === 0.50) return '1/2';
    if (type === 1.00) return 'POT';
    return null;
  };
  const result = potSize * type;
  const isDisabled = result <= minRaise;
  return (
    <FlagButtonWrapper
      onClick={() => updateAmount(result)}
      sliderOpen={sliderOpen}
      name="flag-button"
      disabled={isDisabled}
    >
      {textType()}
    </FlagButtonWrapper>
  );
};
FlagButton.propTypes = {
  potSize: PropTypes.number,
  minRaise: PropTypes.number,
  type: PropTypes.number,
  sliderOpen: PropTypes.bool,
  updateAmount: PropTypes.func,
};

export default FlagButton;
