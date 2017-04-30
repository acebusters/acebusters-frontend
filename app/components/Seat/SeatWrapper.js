/**
 * Created by helge on 15.02.17.
 */

import styled from 'styled-components';

import {
  baseColor,
  background,
  white,
} from 'variables';

export const SeatWrapper = styled.div`
  position: absolute;
  left: ${(props) => props.coords[0]}%;
  top: ${(props) => props.coords[1]}%;
  color: ${white};
  width: 10%;
  height: 25%;
`;

export const DealerButton = styled.div`
  border-radius: 50%;
  ${(props) => (!(props.dealer === props.pos)) ? 'display: none;' : ''}
  border: 4px solid ${baseColor}
  width: 1.5em;
  height: 1.5em;
  background: ${background};
  text-align: center;
  color: white;
  position: absolute;
`;

export const CardContainer = styled.div`
  position: absolute;
  left: -50%;
  ${(props) => (props.folded) ? 'display: none' : ''}
`;
