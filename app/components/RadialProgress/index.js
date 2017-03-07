/**
 * Created by helge on 06.03.17.
 */
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  ${(props) => {
    if (props.progress < 50) {
      return `background-image: linear-gradient(90deg, #ffffff 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(${90 + (props.progress * 3.6)}deg, #00c5ef 50%, #ffffff 50%, #ffffff);`;
    } else if (props.progress === 50) {
      return `background-image: linear-gradient(-90deg, #00c5ef 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, #00c5ef 50%, #ffffff 50%, #ffffff)`;
    } else if (props.progress > 50 && props.progress < 75) {
      return `background-image: linear-gradient(${(-90 + ((props.progress - 50) * 3.6))}deg, #00c5ef 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, #00c5ef 50%, #ffffff 50%, #ffffff)`;
    }
    return `background-image: linear-gradient(${(props.progress - 75) * 3.6}deg, #00c5ef 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), 
      linear-gradient(270deg, #00c5ef 50%, #ffffff 50%, #ffffff)`;
  }}
  position: relative;
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background-color: $white;
  box-sizing: border-box;

  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, 0);
`;

const Progress = styled.div`
  border-radius: 50%;
  width: 112px;
  height: 112px;
  background: #FFF;
  position: absolute;
  box-sizing: border-box;

  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Percentage = styled.div`
  position: absolute;
  width: 50px;
  left: 50%;
  top: 50%;
  text-align: center
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

function Radial(props) {
  return (
    <Wrapper progress={props.progress}>
      <Progress>
        <Percentage>
          { props.msg }
        </Percentage>
      </Progress>
    </Wrapper>
  );
}

Radial.propTypes = {
  progress: React.PropTypes.number,
  msg: React.PropTypes.string,
};

export default Radial;
