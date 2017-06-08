/**
 * Created by helge on 17.02.17.
 */

import React from 'react';

import {
  ControlPanel,
  ActionBarWrapper,
  Icon,
  ActionButtonWrapper,
} from './styles';

export function ActionButton(props) {
  const onClick = (e) => {
    if (props.disabled) return;
    props.onClick(e);
  };

  return (
    <ActionButtonWrapper onClick={onClick} size={props.size} disabled={props.disabled} >
      { !props.text &&
        <Icon className={props.icon} disabled={props.disabled} />
      }
      { props.text }
    </ActionButtonWrapper>
  );
}

export function ActionBarComponent(props) {
  return (
    <ActionBarWrapper {...props} id="action-bar">
      <ControlPanel {...props}>
      </ControlPanel>
    </ActionBarWrapper>
  );
}

ActionButton.propTypes = {
  text: React.PropTypes.string,
  size: React.PropTypes.string,
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func,
  disabled: React.PropTypes.bool,
};

ActionBarComponent.propTypes = {};
