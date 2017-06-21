import React from 'react';

import {
  ActionButtonWrapper,
  ActionIndicator,
  ActionText,
} from './styles';

const ActionButton = (props) => {
  const {
    active,
    buttonActive,
    handleClick,
    mode,
    name,
    setActionBarMode,
    setActionBarBetSlider,
    setActionBarButtonActive,
    type,
    text,
  } = props;
  // highlight button if stored in state
  const selected = mode === type;
  // if button is in onMouseDown, as stored in buttonActive state
  const btnActive = buttonActive === type;
  // disable button if actioBar is not active or if mode matches
  const disabled = !active || props.disabled || selected;
  const handleThisClick = () => {
    setActionBarButtonActive('');
    if (disabled) return;
    setActionBarBetSlider(false);
    setActionBarMode(type);
    handleClick();
  };
  return (
    <ActionButtonWrapper
      type={type}
      name={name}
      // onClick={handleThisClick}
      onMouseDown={() => setActionBarButtonActive(type)}
      onMouseUp={handleThisClick}
      onMouseLeave={() => setActionBarButtonActive('')}
      disabled={disabled}
    >
      <ActionIndicator type={type} active={btnActive || selected} />
      <ActionText type={type}>{text}</ActionText>
    </ActionButtonWrapper>
  );
};

ActionButton.propTypes = {
  active: React.PropTypes.bool,
  buttonActive: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  mode: React.PropTypes.string,
  name: React.PropTypes.string,
  type: React.PropTypes.string,
  setActionBarButtonActive: React.PropTypes.func,
  handleClick: React.PropTypes.func,
  setActionBarMode: React.PropTypes.func,
  setActionBarBetSlider: React.PropTypes.func,
  text: React.PropTypes.string,
};

export default ActionButton;
