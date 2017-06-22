import React from 'react';

import { FlagBet } from './styles';
import { formatNtz } from '../../utils/amountFormater';

const FlagAmountBet = ({
  amount,
  sliderOpen,
}) => (
  <FlagBet sliderOpen={sliderOpen}>
    {formatNtz(amount)}
  </FlagBet>
);
FlagAmountBet.propTypes = {
  amount: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
};

export default FlagAmountBet;
