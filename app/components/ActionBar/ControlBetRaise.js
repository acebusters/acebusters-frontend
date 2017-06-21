import React from 'react';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';

const ControlBetRaise = (props) => {
  const {
    amountToCall,
    handleAllIn,
    handleBet,
    minRaise,
    mode,
    myStack,
    sliderOpen,
    setActionBarBetSlider,
  } = props;
  // after clicking BET or RAISE buttons, the slider will open
  // and display buttons with indicators
  if (sliderOpen) {
    if (mode === 'BET-SET') {
      return (
        <ActionButton
          name="bet-confirm-button"
          text="Bet"
          type="BET-CONFIRM"
          handleClick={() => handleBet()}
          {...props}
        />
      );
    }
    return (
      <ActionButton
        name="raise-confirm-button"
        text="Raise"
        type="RAISE-CONFIRM"
        handleClick={() => handleBet()}
        {...props}
      />
    );
  }

  // after confirming the raise amount in the slider,
  // the buttons will change to (in the future) all you to
  // edit they raise or bet amount
  if (mode === 'RAISE-CONFIRM') {
    return (
      <ActionButton
        name="raise-confirm-button"
        text="Raise"
        type="RAISE-EDIT"
        handleClick={() => setActionBarBetSlider(true)}
        {...props}
      />
    );
  }
  if (mode === 'BET-CONFIRM') {
    return (
      <ActionButton
        name="bet-button"
        text="Bet"
        type="BET-EDIT"
        handleClick={() => setActionBarBetSlider(true)}
        {...props}
      />
    );
  }

  // ActionBar will initially present these button options
  if (amountToCall === 0) {
    return (
      <ActionButton
        name="button-bet"
        text="Bet"
        type="BET-SET"
        handleClick={() => setActionBarBetSlider(true)}
        {...props}
      />
    );
  }
  if (myStack < amountToCall || myStack < minRaise) {
    return (
      <ActionButton
        name="button-all-in"
        text="All-In"
        type="ALL-IN"
        handleClick={() => handleAllIn()}
        {...props}
      />
    );
  }
  if (myStack > amountToCall) {
    return (
      <ActionButton
        name="button-raise"
        text="Raise"
        type="RAISE-SET"
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
  mode: React.PropTypes.string,
  myStack: React.PropTypes.number,
  sliderOpen: React.PropTypes.bool,
  setActionBarBetSlider: React.PropTypes.func,
};

export default ControlBetRaise;
