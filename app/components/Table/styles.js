/** TableMenu styles
 * Created by zobroj on 20170531
 */

import styled from 'styled-components';

import {
  black,
  white,
  curtainStickyWidth,
  curtainWidth,
  tableNameWidth,
} from 'variables';

export const TableContainer = styled.div`
  position: relative;
  padding-top: 5%;
  margin-right: auto;
  margin-left: auto;
  height: 100vh;
  @media (min-width: ${curtainStickyWidth}) {
    margin-left: ${curtainWidth};
  }
`;

export const TableName = styled.h2`
  font-size: 18px;
  z-index: 2000;

  position: absolute;
  top: 10px;
  left: 165px;
  right: 165px;

  overflow: hidden;
  margin: 0;

  white-space: nowrap;
  text-align: center;

  color: #FFF;

  @media (max-width: ${tableNameWidth}) {
    text-align: left;
    left: 20px;
  }
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
  top: 40%;
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
  transform: translate(-50%, -50%);
  top: 48vh;
  left: 50%;
  width: 100%;
  margin-top: -75px;
  padding: 200px 20%;
`;
