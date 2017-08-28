/**
 * Created by helge on 16.02.17.
 */

import styled from 'styled-components';

export const Board = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 255px;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;

export const BoardCardWrapper = styled.div`
  float: left;
  margin-left: 0.5em;
`;
