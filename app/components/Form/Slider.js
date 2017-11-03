import React from 'react';
import PropTypes from 'prop-types';
import RCSlider from 'rc-slider';
import FormGroup from './FormGroup';

const Slider = ({ input, ...props }) => (
  <FormGroup>
    <RCSlider {...input} {...props} />
  </FormGroup>
);
Slider.propTypes = {
  input: PropTypes.object,
};

export default Slider;
