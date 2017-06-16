import React from 'react';

import {
  ActionButtonWrapper,
  ActionIndicator,
  ActionText,
} from './styles';

const ActionButton = (props) => {
  // disable button if actioBar is not active or if mode matches
  const disabled = !props.active || (props.mode === props.newMode);
  const handleThisClick = () => {
    if (disabled) return;
    props.setActionBarBetSlider(false);
    props.setActionBarMode(props.newMode);
    props.handleClick();
  };
  return (
    <ActionButtonWrapper
      name={props.name}
      onClick={handleThisClick}
      disabled={disabled}
    >
      <ActionIndicator />
      <ActionText>{props.text}</ActionText>
    </ActionButtonWrapper>
  );
};

ActionButton.propTypes = {
  active: React.PropTypes.bool,
  mode: React.PropTypes.string,
  name: React.PropTypes.string,
  newMode: React.PropTypes.string,
  handleClick: React.PropTypes.func,
  setActionBarMode: React.PropTypes.func,
  setActionBarBetSlider: React.PropTypes.func,
  text: React.PropTypes.string,
};

export default ActionButton;
