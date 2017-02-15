/**
 * Created by helge on 15.02.17.
 */

import styled from 'styled-components';
import {
  navy,
  orange,
} from 'variables';

export const SeatWrapper = styled.div`
  padding: 5em;
  position: relative;
`;

export const ImageContainer = styled.div`
  border-radius: 50%;
  border: 4px solid ${(props) => (props.whosTurn === props.pos) ? orange : navy};
  width: 5.5em;
  height: 5.5em;
  background: #FFF;
  text-align: center;
  color: white;
  position: absolute;
  cursor: pointer;
  z-index: 10;
`;

export const InfoContainer = styled.div`
  width: 12em;
  height: 5.5em;
  margin-left: 2.75em;
  border-radius: 25%;
  background: #FFF;
  position: absolute;
  border: 4px solid ${navy};
`;

export const CardContainer = styled.div`
  width: 7em;
  height: 5.5em;
  text-align: center;
  margin-top: -4em;
  margin-left: 4em;
  ${(props) => (props.folded) ? 'display: none' : ''}
`;
