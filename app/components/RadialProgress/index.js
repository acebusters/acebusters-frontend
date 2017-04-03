/**
 * Created by helge on 06.03.17.
 */
import React from 'react';
import styled from 'styled-components';

import {
  baseColor,
  white,
} from '../../variables';

const Wrapper = styled.div`
  ${(props) => {
    if (props.progress < 50) {
      return `background-image: linear-gradient(90deg, #ffffff 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(${90 + (props.progress * 3.6)}deg, ${baseColor} 50%, #ffffff 50%, #ffffff);`;
    } else if (props.progress === 50) {
      return `background-image: linear-gradient(-90deg, ${baseColor} 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, ${baseColor} 50%, #ffffff 50%, #ffffff)`;
    } else if (props.progress > 50 && props.progress < 75) {
      return `background-image: linear-gradient(${(-90 + ((props.progress - 50) * 3.6))}deg, ${baseColor} 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, ${baseColor} 50%, #ffffff 50%, #ffffff)`;
    }
    return `background-image: linear-gradient(${(props.progress - 75) * 3.6}deg, ${baseColor} 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, ${baseColor} 50%, #ffffff 50%, #ffffff)`;
  }}
  position: relative;
  width: 270px;
  height: 270px;
  border-radius: 50%;
  background-color: $white;
  viewBox: 0 0 250 250;

  left: 50%;
  top: 50%;
  margin: 2em;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, 0);
`;

const Progress = styled.div`
  border-radius: 50%;
  width: 250px;
  height: 250px;
  position: absolute;
  viewBox: 0 0 250 250;
  background: ${white};
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Percentage = styled.div`
  position: absolute;
  viewBox: 0 0 250 250;
  display: block;
  width: 100%;
  text-align: center;
  line-height: 1;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
  font-size: 5em;
  margin: 0;
`;

function Radial(props) {
  return (
    <Wrapper progress={props.progress}>
      <Progress>
        <Percentage>
          { props.progress }
        </Percentage>
      </Progress>
    </Wrapper>
  );
}

Radial.propTypes = {
  progress: React.PropTypes.any,
};

export default Radial;
