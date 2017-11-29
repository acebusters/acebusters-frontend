import styled from 'styled-components';
import { baseColor } from '../../variables';

export const CopyIcon = styled.i`
  position: absolute;
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
