/** TableMenu styles
 * Created by zobroj on 20170531
 */

import styled from 'styled-components';

import {
  black,
  white,
  backgroundTable,
  curtainStickyWidth,
  curtainWidth,
} from 'variables';

export const TableContainer = styled.div`
  background-image: ${backgroundTable};
  margin-top: 5%;
  margin-right: auto;
  margin-left: auto;
  
  @media (min-width: ${curtainStickyWidth}) {
    margin-left: ${curtainWidth};
  }
`;

export const TableHeader = styled.div`
   position: relative;
   
   text-align: left;
   color: ${white};
   padding-left: 10em;
`;

export const Wrapper = styled.div`
  position: absolute;
  left: 2em;
  z-index: 1;
  height: 10%
  width: 20%;
  bottom: 2em;

  @media (min-width: ${curtainStickyWidth}) {
    left: calc(${curtainWidth} + 2em);
  }
`;

export const Winner = styled.div` 
  left: 50%;
  top: 100%;
  position: absolute;
  padding: 0.5em;
  background-color: ${black};
  border-radius: 0.5em;
  color: ${white};
  transform: translate(-50%,-20%);
`;

export const TableAndChairs = styled.div`
  position: relative;
  width: 100%;
  padding: 25%;
`;

export const HandBox = styled.div`
  left: 80%;
  top: 80%;
  position: absolute;
  padding: 0.5em;
  background-color: ${black};
  border-radius: 0.5em;
  color: ${white};
  transform: translate(-50%,-20%);
`;

export const PokerTable = styled.div`
  position: absolute;
  transform: translateX(-50%);
  top: -20%;
  left: 50%;
  width: 100%;
  height: 150%;
  padding: 20%;
`;
