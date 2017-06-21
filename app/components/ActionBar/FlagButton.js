import React from 'react';

import { FlagButtonWrapper } from './styles';

const FlagButton = ({
  type,
  sliderOpen,
}) => {
  const textType = () => {
    if (type === 'quarter') return '1/4';
    if (type === 'half') return '1/2';
    if (type === 'pot') return 'POT';
    return null;
  };
  return (
    <FlagButtonWrapper sliderOpen={sliderOpen} name="flag-button">
      {textType()}
    </FlagButtonWrapper>
  );
};
FlagButton.propTypes = {
  type: React.PropTypes.string,
  sliderOpen: React.PropTypes.bool,
};

export default FlagButton;
