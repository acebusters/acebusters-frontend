/**
 * Created by helge on 15.02.17.
 */

import styled from 'styled-components';

import {
  navy,
  orange,
  gray,
} from 'variables';

export const SeatWrapper = styled.div`
  position: absolute;
  left: ${(props) => props.coords[0]}%;
  top: ${(props) => props.coords[1]}%;
`;

export const ImageContainer = styled.div`
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%,-50%);
  border: 4px solid ${(props) => {
    if (props.whosTurn === props.pos) {
      return orange;
    }
    if (props.lastAction === 'sitOut') {
      return gray;
    }
    return navy;
  }};
  
  background: ${(props) => {
    if (props.pending) {
      return orange;
    }
    return '#FFF';
  }};
  ${(props) => {
    if (props.computedStyles && props.computedStyles.d > 600) {
      return 'width: 5em; height: 5em;';
    }
    return 'width: 3em; height: 3em;';
  }}
  text-align: center;
  ${(props) => (props.open) ? 'cursor: pointer' : ''};
  z-index: 10;
`;

export const SeatLabel = styled.div`
  position: absolute;
  ${(props) => {
    if (props.computedStyles && props.computedStyles.d > 600) {
      return 'font-size: 1em';
    }
    return 'font-size: 0.5em';
  }}
  top: 50%;
  left: 50%;  
  transform: translate(-50%,-50%);
`;

export const DealerButton = styled.div`
  border-radius: 50%;
  ${(props) => (!(props.hand.dealer === props.pos)) ? 'display: none;' : ''}
  border: 4px solid ${(orange)}
  width: 1.5em;
  height: 1.5em;
  background: ${(navy)};
  text-align: center;
  color: white;
  position: absolute;
  z-index: 10;
`;

export const CardContainer = styled.div`
  position absolute;
  ${(props) => (props.folded) ? 'display: none' : ''}
`;
