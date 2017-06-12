import React from 'react';

import {
  ActionButtonWrapper,
  Icon,
} from './styles';

const ActionButton = (props) => {
  const onClick = (e) => {
    if (props.disabled) return;
    props.onClick(e);
  };
  return (
    <ActionButtonWrapper
      name={props.name}
      onClick={onClick}
      size={props.size}
      disabled={props.disabled}
    >
      { !props.text &&
        <Icon className={props.icon} disabled={props.disabled} />
      }
      { props.text }
    </ActionButtonWrapper>
  );
};

ActionButton.propTypes = {
  text: React.PropTypes.string,
  size: React.PropTypes.string,
  icon: React.PropTypes.string,
  name: React.PropTypes.string,
  onClick: React.PropTypes.func,
  disabled: React.PropTypes.bool,
};

export default ActionButton;
