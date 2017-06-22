import React from 'react';
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
    backgroundColor: '#333',
    height: '6px',
  },
};

const Handle = RCSlider.Handle;

const handle = (props) => {
  const {
    value,
    dragging,
    // index,
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
  // index: React.PropTypes.number,
};

const Slider = (props) => (
  <SliderWrapper name="slider-wrapper">
    <RCSlider
      min={props.minRaise}
      max={props.myStack}
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
  updateAmount: React.PropTypes.func,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
};

export default Slider;
