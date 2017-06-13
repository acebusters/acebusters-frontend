import styled from 'styled-components';
import {
  baseColor,
} from 'variables';

export const ChatPlaceholder = styled.div`
  padding: 10px;
  font-style: italic;
  color: ${baseColor};
`;

export const ChatContainer = styled.div`
  height: calc(100% - 80px);
`;

export const ChatArea = styled.div`
  width: 100%;
  height: calc(100% - 40px);
`;

export const ChatBox = styled.div`
  width: 100%;
  height: 40px;
`;
