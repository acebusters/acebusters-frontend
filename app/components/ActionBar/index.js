/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  white,
  gray,
} from '../../variables';

const ControlPanel = styled.div`
  width: 100%;
  margin-top: 5em;
`;

const ActionBarWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 10%
  width: 15%;
  bottom: 0px;
`;

const Icon = styled.i`
  color: ${(props) => props.disabled ? gray : white};
  &:hover {
    color: ${(props) => props.disabled ? gray : baseColor};
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  }
  font-size: 2em !important;
`;

export const ActionButtonWrapper = styled.button`
  border-radius: 50%;
  margin-left: 0.5em;
  color: ${(props) => props.disabled ? gray : white};
  border: 2px solid ${(props) => props.disabled ? gray : white};
  ${(props) => {
    if (props.size === 'medium') {
      return `width: 5em;
              height: 5em;`;
    } else if (props.size === 'small') {
      return `width: 3.5em;
              height: 3.5em;`;
    }
    return `width: 6em;
            height: 6em;`;
  }};
  margin-bottom: 2em;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.disabled ? gray : baseColor};
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

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
