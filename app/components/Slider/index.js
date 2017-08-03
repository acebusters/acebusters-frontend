import React from 'react';
import PropTypes from 'prop-types';
import RCSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { SliderWrapper, SliderHandle, SliderDot } from '../ActionBar/styles';

const styles = {
  rail: {
    backgroundColor: '#333',
    height: '6px',
    marginTop: '4px',
  },
  track: {
    backgroundColor: 'none',
    height: 0,
  },
};

const generateMarks = (sb, min, max) => {
  const step = sb * 2;
  const marks = {};
  for (let i = min; i < max; i += step) {
    // add a mark
    marks[i] = '';
    // add a mark for the last position
    if (i + step >= max) {
      marks[max] = '';
    }
  }
  return marks;
};

const Handle = RCSlider.Handle;

const handle = (props) => {
  const {
    value,
    dragging,
    ...restProps } = props;
  return (
    <Handle value={value} {...restProps}>
      <SliderHandle>
        <SliderDot active={dragging} />
      </SliderHandle>
    </Handle>
  );
};
handle.propTypes = {
  value: React.PropTypes.number,
  dragging: React.PropTypes.bool,
};

const Slider = (props) => (
  <SliderWrapper name="slider-wrapper">
    <RCSlider
      min={props.minRaise}
      max={props.myStack}
      marks={generateMarks(props.sb, props.minRaise, props.myStack)}
      step={null}
      value={props.amount}
      onChange={(value) => props.updateAmount(value)}
      onAfterChange={(value) => props.updateAmount(value)}
      handle={handle}
      railStyle={styles.rail}
      trackStyle={styles.track}
    />
  </SliderWrapper>
  );
Slider.propTypes = {
  amount: PropTypes.number,
  sb: PropTypes.number,
  updateAmount: PropTypes.func,
  minRaise: PropTypes.number,
  myStack: PropTypes.number,
};

export default Slider;
