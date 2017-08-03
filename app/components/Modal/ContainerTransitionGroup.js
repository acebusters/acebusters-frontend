import CSSTransitionGroup from 'react-addons-css-transition-group';
import styled from 'styled-components';

const appear = 'modal-container-appear';
const appearActive = 'modal-container-appear-active';
const appearTimeout = 200;

export const ContainerTransitionGroup = styled(CSSTransitionGroup).attrs({
  transitionName: { appear, appearActive },
  transitionAppear: true,
  transitionAppearTimeout: appearTimeout,
  transitionEnterTimeout: 0,
  transitionLeaveTimeout: 0,
})`
  .${appear} {
    opacity: 0;
  }

  .${appearActive} {
    opacity: 1;
    transition: opacity ${appearTimeout}ms ease-in;
  }
`;
