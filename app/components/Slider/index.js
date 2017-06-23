import React from 'react';
import RCSlider from 'rc-slider';

import { SliderWrapper, SliderHandle, SliderDot } from '../ActionBar/styles';

const styles = {
  rail: {
    backgroundColor: '#333',
    height: '6px',
    marginTop: '4px',
  },
  track: {
    backgroundColor: '#333',
    height: '6px',
  },
};

const generateMarks = (sb, min, max) => {
  const step = sb * 2;
  const marks = {};
  for (let i = min; i < max; i += step) {
    // add a mark
    marks[i] = { style: {}, label: '' };
    // add a mark for the last position
    if (i + step >= max) {
      marks[max] = { style: {}, label: '' };
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
  amount: React.PropTypes.number,
  sb: React.PropTypes.number,
  updateAmount: React.PropTypes.func,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
};

export default Slider;
