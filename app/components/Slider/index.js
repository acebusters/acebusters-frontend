/**
 * Created by helge on 09.03.17.
 */
import React from 'react';
import styled from 'styled-components';

const StyledSlider = styled.input`
  float:left;
  
  -webkit-appearance: none;
  width: 100%;
  margin: 2.5px 0;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
    background: #3e76b0;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  &::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 0px solid #ffffff;
    height: 17px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -2.7px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #5f92c7;
  }
`;

export function Slider(props) {
  return (
    <StyledSlider {...props} type="range" min={props.min} max={props.max} step={props.step} />
  );
}

Slider.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
};

export default Slider;
