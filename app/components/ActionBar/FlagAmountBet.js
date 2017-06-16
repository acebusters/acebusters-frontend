import React from 'react';

import { FlagBet } from './styles';

const FlagAmountBet = ({
  amount,
  amountToCall,
  sliderOpen,
}) => (
  <FlagBet sliderOpen={sliderOpen}>
    {amountToCall !== 0 ?
        `RAISE ${amount}`
      :
        `BET ${amount}`
      }
  </FlagBet>
);
FlagAmountBet.propTypes = {
  amount: React.PropTypes.number,
  amountToCall: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
};

export default FlagAmountBet;
