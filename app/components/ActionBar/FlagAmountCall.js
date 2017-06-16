import React from 'react';

import { FlagCall } from './styles';

const FlagAmountCall = ({
  amountToCall,
  sliderOpen,
  myStack,
}) => {
  // hide flag if only option is to 'check' or 'all-in'
  if (amountToCall === 0 || amountToCall > myStack) {
    return null;
  }
  return (
    <FlagCall sliderOpen={sliderOpen}>
      {amountToCall}
    </FlagCall>
  );
};
FlagAmountCall.propTypes = {
  amountToCall: React.PropTypes.number,
  myStack: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
};

export default FlagAmountCall;
