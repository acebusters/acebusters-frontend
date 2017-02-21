/**
 * Created by helge on 15.02.17.
 */
import styled from 'styled-components';

export const InfoBox = styled.div`
  width: 80%;
  height: 50%;
  background: #FFF;
  border-radius: 25%;
  text-align: center;
  color: black;
  float: left;
  overflow: hidden;
  margin-left: 15%;
`;

export const ActionBox = styled.div`
  margin-left: ${(props) => props.amountCoords[0]}em;
  margin-top: ${(props) => props.amountCoords[1]}em;
  color: white;
`;
