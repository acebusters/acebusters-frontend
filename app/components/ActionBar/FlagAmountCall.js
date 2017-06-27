import React from 'react';
import PropTypes from 'prop-types';

import { FlagCall } from './styles';
import { formatNtz } from '../../utils/amountFormater';

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
      {formatNtz(amountToCall)}
    </FlagCall>
  );
};
FlagAmountCall.propTypes = {
  active: PropTypes.bool,
  amountToCall: PropTypes.number,
  myStack: PropTypes.number,
  sliderOpen: PropTypes.bool,
};

export default FlagAmountCall;
