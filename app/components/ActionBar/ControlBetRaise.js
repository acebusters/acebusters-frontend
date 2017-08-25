import React from 'react';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';

import {
  ALL_IN,
  BET_SET,
  BET,
} from '../../containers/ActionBar/actions';

const ControlBetRaise = (props) => {
  const {
    amount,
    amountToCall,
    minRaise,
    myStack,
    sliderOpen,
  } = props;
  const allIn = myStack <= amountToCall || myStack <= minRaise;
  const text = () => {
    if (amount === myStack) return 'All-In';
    if (amountToCall === 0) return 'Bet';
    if (myStack > amountToCall) return 'Raise';
    return 'Bet';
  };
  // after clicking BET or RAISE buttons, the slider will open
  // and display buttons with indicators
  if (sliderOpen) {
    return (
      <ActionButton
        name="button-bet-confirm"
        text={text()}
        type={BET}
        {...props}
      />
    );
  }
  // ActionBar will initially present these button options
  if (allIn) {
    return (
      <ActionButton
        name="button-all-in"
        text="All-In"
        type={ALL_IN}
        {...props}
      />
    );
  }
  return (
    <ActionButton
      name="button-bet"
      text={text()}
      type={BET_SET}
      {...props}
    />
  );
};
ControlBetRaise.propTypes = {
  amount: PropTypes.number,
  amountToCall: PropTypes.number,
  minRaise: PropTypes.number,
  myStack: PropTypes.number,
  sliderOpen: PropTypes.bool,
};

export default ControlBetRaise;
