import styled from 'styled-components';
import { Button as ButtonBase } from '../../utils/styleUtils';
import {
  activeColor as activeBg,
  hover as hoverBg,
} from '../../variables';

const fontColor = '#979797';

// Dropdown base styles
export const Container = styled.div`
  padding: 4px;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
`;

export const Button = styled(ButtonBase)`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 10px 12px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.50);
  width: 100%;
  color: ${fontColor};
  &:hover {
    color: white;
    background-color: ${hoverBg};
  }
  &:active {
    color: white;
    background-color: ${activeBg};
  }
`;

export const Caret = styled.i`
  margin-left: auto;
  padding: 0 10px;
  &:before {
    font-size: 1.5em;
  }
`;

// Modal
export const ModalContainer = styled(Container)`
  min-width: 180px;
`;
export const ModalButton = styled(Button)`
  margin-top: 6px;
  &:first-child {
    margin-top: 0;
  }
`;

// Token Button
export const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 100px;
`;

export const TokenIcon = styled.div`
  align-self: center;
  justify-content: center;
`;

export const TokenName = styled.div`
  margin-left: 6px;
`;

// Toggle Button
export const ToggleContainer = styled(Container)`
  height: 100%;
  background-color: #ddd;
`;

export const ToggleButton = styled(Button)`
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  padding: 0;
  margin: 0;
  background: none;
  box-shadow: none;
`;

export const ToggleOption = styled.div`
  flex: auto;
  padding: 5px;
  ${(props) => props.selected ?
    `
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    `
    :
    null
  };
  color: ${fontColor};
  font-size: 1.1em;
`;
