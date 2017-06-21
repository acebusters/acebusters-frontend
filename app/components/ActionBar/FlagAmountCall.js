import React from 'react';

import { FlagCall } from './styles';

const FlagAmountCall = ({
  active,
  amountToCall,
  sliderOpen,
  myStack,
}) => {
  // hide flag if only option is to 'check' or 'all-in'
  const hide = amountToCall === 0 || amountToCall > myStack || !active;
  return (
    <FlagCall hide={hide} sliderOpen={sliderOpen}>
      {amountToCall}
    </FlagCall>
  );
};
FlagAmountCall.propTypes = {
  active: React.PropTypes.bool,
  amountToCall: React.PropTypes.number,
  myStack: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
};

export default FlagAmountCall;
