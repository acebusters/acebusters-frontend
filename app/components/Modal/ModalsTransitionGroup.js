import CSSTransitionGroup from 'react-addons-css-transition-group';
import styled from 'styled-components';

const leave = 'modals-leave';
const leaveActive = 'modals-leave-active';
const leaveTimeout = 200;

export const ModalsTransitionGroup = styled(CSSTransitionGroup).attrs({
  transitionName: { leave, leaveActive },
  transitionLeaveTimeout: leaveTimeout,
  transitionEnter: false,
})`
  .${leave} {
    opacity: 1;
  }

  .${leaveActive} {
    opacity: 0;
    transition: opacity ${leaveTimeout}ms ease-in;
  }
`;
