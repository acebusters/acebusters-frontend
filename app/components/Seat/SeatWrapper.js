/**
 * Created by helge on 15.02.17.
 */

import styled from 'styled-components';

import {
  baseColor,
  background,
  green,
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

export const ChipGreen = styled.p`
  border-radius: 50%;
  width: 1em;
  height: 1em;
  float: left;
  background: ${green}
`;

export const Amount = styled.p`
  display: inline-block;
  margin-left: 0.5em;
  font: inherit;
  line-height: 1em;
  position: absolute;
`;

export const CardContainer = styled.div`
  position: absolute;
  left: -50%;
  ${(props) => (props.folded) ? 'display: none' : ''}
`;
