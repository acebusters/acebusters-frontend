/**
* Created by jzobro 20170531
*/
import styled from 'styled-components';

import {
  baseColor,
  white,
  gray,
} from '../../variables';

export const ControlPanel = styled.div`
  width: 100%;
  margin-top: 5em;
`;

export const ActionBarWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 10%
  width: 15%;
  bottom: 0px;
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
