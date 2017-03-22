/**
 * Created by helge on 15.02.17.
 */
import styled from 'styled-components';

export const AmountBox = styled.div`
  border-radius: 25%;
  color: white;
  ${(props) => `left:${props.amountCoords[0]}%;top:${props.amountCoords[1]}%`};
  line-height: 3em;
  text-align: center;
  position: absolute;
  width: 100%;
`;

export const ActionBox = styled.div`
  color: white;
  font-size: ${(props) => props.fontSize}em;
  text-align: center;
  position: absolute;
  transform: translateY(25%);
  width: 100%;
  -webkit-transition: opacity 0.1s ease-in-out;
  -moz-transition: opacity 0.1s ease-in-out;
  -ms-transition: opacity 0.1s ease-in-out;
  -o-transition: opacity 0.1s ease-in-out;
  opacity: ${(props) => props.opacity};
`;

export const StackBox = styled.div`
  margin-top: 0%;
  width: 100%;
  left: 115%;
  bottom: 15%;
  border-radius: 25%;
  color: white;
  text-align: center;
  position: absolute;
`;

export const NameBox = styled.div`
  margin-top: 25%;
  width: 100%;
  overflow: hidden;
  left: 115%;
  bottom: 50%;
  border-radius: 25%;
  color: white;
  text-align: center;
  position: absolute;
`;

export const TimeBox = styled.div`
  margin-top: 40%;
  width: 100%;
  overflow: hidden;
  border-radius: 25%;
  color: white;
  text-align: center;
  position: absolute;
`;

