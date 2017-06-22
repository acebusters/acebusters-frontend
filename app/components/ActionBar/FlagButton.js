import React from 'react';

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
  potSize: React.PropTypes.number,
  minRaise: React.PropTypes.number,
  type: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
  updateAmount: React.PropTypes.func,
};

export default FlagButton;
