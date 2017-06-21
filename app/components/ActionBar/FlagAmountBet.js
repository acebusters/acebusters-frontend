import React from 'react';

import { FlagBet } from './styles';

const FlagAmountBet = ({
  amount,
  sliderOpen,
}) => (
  <FlagBet sliderOpen={sliderOpen}>
    {amount}
  </FlagBet>
);
FlagAmountBet.propTypes = {
  amount: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
};

export default FlagAmountBet;
