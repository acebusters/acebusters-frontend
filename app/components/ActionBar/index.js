/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  fontPrimary,
  background,
  gray,
} from '../../variables';

const ControlPanel = styled.div`
  width: 100%;
  margin-top: 5em;
`;

const ActionBarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%
  width: 5%;
`;

export const ActionButtonWrapper = styled.button`
  border-radius: 50%;
  color: ${fontPrimary};
  border: 2px solid #fff;
  width: 5em;
  height: 5em;
  margin-bottom: 2em;
  cursor: pointer;  
  
  &:hover {
    color: ${baseColor};
    background-color: ${background};
    border: 2px solid ${baseColor}
  }
  
  &:active {
    border: 2px solid #fff;
    width: 8.5em;
    height: 8.5em;
  }
  
  &:disabled {
    border: 2px solid ${gray};
    color:  ${gray};
    cursor: initial;
  }
`;

export function ActionButton(props) {
  return (
    <ActionButtonWrapper>
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
};

ActionBarComponent.propTypes = {};
