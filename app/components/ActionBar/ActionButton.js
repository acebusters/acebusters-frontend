import React from 'react';
import PropTypes from 'prop-types';

import {
  ActionButtonWrapper,
  ActionIndicator,
  ActionText,
} from './styles';

const ActionButton = (props) => {
  const {
    active,
    buttonActive,
    handleClickButton,
    mode,
    name,
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
    if (disabled) return;
    // handle situation where player mouseDown drags button from another button
    if (buttonActive !== type) return;
    handleClickButton(type);
  };
  const handleThisLeave = () => {
    if (disabled) return;
    setActionBarButtonActive('');
  };
  return (
    <ActionButtonWrapper
      type={type}
      name={name}
      onMouseDown={() => setActionBarButtonActive(type)}
      onMouseUp={handleThisClick}
      onMouseLeave={handleThisLeave}
      disabled={disabled}
    >
      <ActionIndicator type={type} active={btnActive || selected} />
      <ActionText type={type}>{text}</ActionText>
    </ActionButtonWrapper>
  );
};

ActionButton.propTypes = {
  active: PropTypes.bool,
  buttonActive: PropTypes.string,
  disabled: PropTypes.bool,
  handleClickButton: PropTypes.func,
  mode: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  setActionBarButtonActive: PropTypes.func,
  text: PropTypes.string,
};

export default ActionButton;
