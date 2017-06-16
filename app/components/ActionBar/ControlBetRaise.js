import React from 'react';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';

const ControlBetRaise = (props) => {
  const {
    amountToCall,
    handleAllIn,
    handleBet,
    minRaise,
    myStack,
    sliderOpen,
    setActionBarBetSlider,
  } = props;
  if (sliderOpen) {
    return (
      <ActionButton
        name="bet-button"
        text="CONFIRM"
        newMode="CONFIRM"
        handleClick={() => handleBet()}
        {...props}
      />
    );
  }
  if (amountToCall === 0) {
    return (
      <ActionButton
        name="button-bet"
        text="BET"
        newMode="BET"
        handleClick={() => setActionBarBetSlider(true)}
        {...props}
      />
    );
  }
  if (myStack < amountToCall || myStack < minRaise) {
    return (
      <ActionButton
        name="button-all-in"
        text="ALL-IN"
        newMode="ALL-IN"
        handleClick={() => handleAllIn()}
        {...props}
      />
    );
  }
  if (myStack > amountToCall) {
    return (
      <ActionButton
        name="button-raise"
        text="RAISE"
        newMode="RAISE"
        handleClick={() => setActionBarBetSlider(true)}
        {...props}
      />
    );
  }
  return <ControlBlank {...props} />;
};
ControlBetRaise.propTypes = {
  amountToCall: React.PropTypes.number,
  handleBet: React.PropTypes.func,
  handleAllIn: React.PropTypes.func,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
  setActionBarBetSlider: React.PropTypes.func,
};

export default ControlBetRaise;
