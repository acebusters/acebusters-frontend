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
  margin-top: 18px;
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
  padding-bottom: 50%;
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
  margin-top: 10%;
  border-radius: 50%;
  transform: translateX(-50%);
  left: 50%;
  width: 50%;
  height: 40%;
  z-index: 5;
`;
