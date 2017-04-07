/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  white,
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
  color: ${(white)};
  &:hover {
    color: ${baseColor};
    cursor: pointer;
  }
  font-size: 2em !important; 
`;

export const ActionButtonWrapper = styled.button`
  border-radius: 50%;
  margin-left: 0.5em;
  color: ${white};
  border: 2px solid ${white};
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
    color: ${baseColor};
    cursor: pointer;
  }
`;

export function ActionButton(props) {
  return (
    <ActionButtonWrapper onClick={props.onClick} size={props.size}>
      { !props.text &&
        <Icon className={props.icon} />
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
};

ActionBarComponent.propTypes = {};
