import styled from 'styled-components';

import {
  boxedLayoutMaxWidth,
  backgroundBoxed,
  backgroundTableColor,
  transitionSpeed,
  transitionFn,
} from 'variables';

const Common = styled.div`
  background: #444;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  ${(props) => (props.boxed && `
    max-width: ${boxedLayoutMaxWidth};
    margin: 0 auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    position: relative;
  `)}
  transition: ${transitionSpeed} ${transitionFn}, width ${transitionSpeed} ${transitionFn};
`;

export const StyledDashboard = styled(Common)`
  background-color: ${backgroundBoxed};
  padding-top: ${(props) => props.move ? '60px' : '20px'};
`;

export const StyledTable = styled(Common)`
  background-color: ${backgroundTableColor};
`;

export const TableNotificationsWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  right: 0;
`;
