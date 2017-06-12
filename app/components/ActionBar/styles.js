/**
* Created by jzobro 20170531
*/
import styled from 'styled-components';

import {
  baseColor,
  white,
  gray,
} from '../../variables';

export const ActionBarWrapper = styled.div`
  display: flex;
  background-color: none;
  position: fixed;
  bottom: 0;
  height: 122px;
  width: 100%;
  bottom: 0px;
`;

export const ControlPanel = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: none;
`;

export const Icon = styled.i`
  color: ${(props) => props.disabled ? gray : white};
  &:hover {
    color: ${(props) => props.disabled ? gray : baseColor};
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  }
  font-size: 2em !important;
`;

export const ActionButtonWrapper = styled.button`
  margin-left: 0.5em;
  margin-bottom: 2em;
  color: ${(props) => props.disabled ? gray : white};
  border-radius: 50%;
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
  cursor: pointer;

  &:hover {
    color: ${(props) => props.disabled ? gray : baseColor};
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;
