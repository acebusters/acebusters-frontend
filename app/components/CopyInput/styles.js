import styled from 'styled-components';
import { baseColor } from '../../variables';

export const Container = styled.label`
  display: inline-block;
  position: relative;
`;

export const CopyIcon = styled.i`
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 50%;
  cursor: pointer;

  transform: translateY(-50%);

  &:hover {
    color: ${baseColor};
  }

  &:active {
    transform: translateY(-50%) scale(0.9);
  }
`;

export const Tooltip = styled.div`
  font-size: 13px;

  position: absolute;
  bottom: 50%;
  right: 18px;

  margin-bottom: 14px;
  padding: 5px 10px;

  opacity: 0;

  color: #FFF;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 3px;

  transform: translate(50%, 15px);
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
              opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;

  &::before {
    position: absolute;
    top: 100%;
    left: 50%;

    margin-left: -2px;

    content: '';

    border: 3px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.6);
  }

  ${Container}:hover & {
    opacity: 1;
    transform: translate(50%, 0);
  }
`;
