/**
 * Created by helge on 14.02.17.
 */
import styled from 'styled-components';


import {
  lightBlue,
} from 'variables';

export const GamePlay = styled.div`
  position: absolute;
  ${() => {
    if (document.getElementById('header')) {
      return `top:${document.getElementById('header').clientHeight}px`;
    }
    return 'top: 0px';
  }};
  ${() => {
    if (document.getElementById('sidebar') && window.innerWidth > 765) {
      return `left:${document.getElementById('sidebar').clientWidth}px`;
    }
    return 'left: 0px';
  }};
  bottom: 0px;
  width: 100%;
`;

export const TableArea = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  position: relative;
`;

export const TableContainer = styled.div`
  ${() => {
    const height = (document.getElementById('action-bar')) ? document.getElementById('action-bar').clientHeight : 0;
    return `height:${ window.innerHeight - height}px`;
  }};
  width: inherit;
`;

export const TableAndChairs = styled.div`
  ${(props) => `height:${ props.computedStyles.computeSize().height}px`};
  ${(props) => `width:${ props.computedStyles.computeSize().width}px`};
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
`;

export const PokerTable = styled.div`
  margin: 0 auto;
  position: relative;
  top: 40%;
  transform: translateY(-40%);
  width: 80%;
  height: 50%;
  background-color: ${lightBlue};
  border: 2px solid beige;
  border-radius: 50%;
`;
