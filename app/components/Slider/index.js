import React from 'react';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import {
  SliderWrapper,
} from './styles';

const SliderContainer = ({
  value,
  min,
  max,
  onChange,
}) => (
  <SliderWrapper name="slider-wrapper">
    <Slider
      data-orientation="vertical"
      value={value}
      min={min}
      max={max}
      step={1}
      onChange={onChange}
    >
    </Slider>
  </SliderWrapper>
);

SliderContainer.propTypes = {
  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  onChange: React.PropTypes.func,
};

export default SliderContainer;
