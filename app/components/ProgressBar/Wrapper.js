import styled from 'styled-components';
import {
  navbarHeight,
} from '../../variables';

export default styled.div`
  position: fixed;
  top: ${navbarHeight};
  left: 0;
  width: 100%;
  visibility: ${(props) => props.hidden ? 'hidden' : 'visible'};
  opacity: ${(props) => props.hidden ? '0' : '1'};
  transition: all 500ms ease-in-out;
  z-index: ${(props) => props.hidden ? '-10' : '9999'};
`;
