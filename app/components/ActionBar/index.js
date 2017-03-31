/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  background,
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

export const ActionButtonWrapper = styled.button`
  border-radius: 50%;
  color: ${white};
  border: 2px solid ${white};
  width: 5em;
  height: 5em;
  margin-bottom: 2em;
  cursor: pointer;  
  
  &:hover {
    color: ${baseColor};
    background-color: transparent;
    border: 2px solid ${background}
    cursor: pointer;
  }
`;

export function ActionButton(props) {
  return (
    <ActionButtonWrapper onClick={props.onClick} >
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
  onClick: React.PropTypes.func,
};

ActionBarComponent.propTypes = {};
