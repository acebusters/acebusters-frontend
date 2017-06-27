import React from 'react';
import PropTypes from 'prop-types';

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
  amount: PropTypes.number,
  sliderOpen: PropTypes.bool,
};

export default FlagAmountBet;
