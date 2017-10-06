import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-rangeslider';
import FormGroup from 'components/Form/FormGroup';

const RangeSlider = ({ input, ...props }) => (
  <FormGroup>
    <Slider
      data-orientation="vertical"
      tooltip={false}
      {...input}
      {...props}
    />
  </FormGroup>
);
RangeSlider.propTypes = {
  input: PropTypes.object,
};

export default RangeSlider;
