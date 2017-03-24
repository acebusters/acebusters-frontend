/**
 * Created by helge on 17.02.17.
 */

import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  fontPrimary,
  background,
} from '../../variables';

const ControlPanel = styled.div`
  width: 100%;
  margin-top: 10em;
`;

const ActionBarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%
  width: 9em;
`;

export const ActionButton = styled.button`
  border-radius: 50%;
  color: ${fontPrimary};
  border: 2px solid #fff;
  width: 8em;
  height: 8em;
  margin-bottom: 2em;
  cursor: pointer;  
  
  &:hover {
    color: ${baseColor};
    background-color: ${background};
    width: 8.5em;
    height: 8.5em;
    border: 2px solid ${baseColor}
  }
  
  &:active {
    color: ${background};
  }
`;

export const ActionButtonWrapper = styled.div`
  text-align: center;
`;

export function ActionBarComponent(props) {
  return (
    <ActionBarWrapper {...props} id="action-bar">
      <ControlPanel {...props}>
      </ControlPanel>
    </ActionBarWrapper>
  );
}

ActionBarComponent.propTypes = {};
