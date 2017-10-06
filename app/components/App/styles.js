import styled from 'styled-components';

import {
  boxedLayoutMaxWidth,
  backgroundBoxed,
  backgroundTableColor,
} from '../../variables';

export const StyledDashboard = styled.div`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }
  /* theme */
  background: #444;
  background-color: ${(props) => props.params.tableAddr ? backgroundTableColor : backgroundBoxed};
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  ${(props) => (props.boxed && `
    max-width: ${boxedLayoutMaxWidth};
    margin: 0 auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    position: relative;
  `)}
`;
