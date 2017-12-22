import React from 'react';
import PropTypes from 'prop-types';

import { FlagButtonWrapper } from './styles';

const FlagButton = ({
  value,
  label,
  minRaise,
  sliderOpen,
  updateAmount,
}) => {
  const isDisabled = value <= minRaise;
  return (
    <FlagButtonWrapper
      onClick={() => updateAmount(value)}
      sliderOpen={sliderOpen}
      name="flag-button"
      disabled={isDisabled}
    >
      {label}
    </FlagButtonWrapper>
  );
};
FlagButton.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  minRaise: PropTypes.number,
  sliderOpen: PropTypes.bool,
  updateAmount: PropTypes.func,
};

export default FlagButton;
