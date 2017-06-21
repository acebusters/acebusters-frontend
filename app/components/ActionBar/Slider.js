import React from 'react';
import RCSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { SliderWrapper, SliderHandle, SliderDot } from './styles';

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

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onSliderUpdate = this.onSliderUpdate.bind(this);
  }
  componentWillMount() {
    this.setState({ value: this.props.minRaise });
    this.props.updateAmount(this.props.minRaise);
  }
  onSliderChange(value) {
    this.setState({ value });
    this.props.updateAmount(value);
  }
  onSliderUpdate(value) {
    this.props.updateAmount(value);
  }
  render() {
    return (
      <SliderWrapper name="slider-wrapper">
        <RCSlider
          min={this.props.minRaise}
          max={this.props.myStack}
          value={this.state.value}
          onChange={this.onSliderChange}
          onAfterChange={this.onSliderUpdate}
          handle={handle}
          railStyle={styles.rail}
          trackStyle={styles.track}
        />
      </SliderWrapper>
    );
  }
}
Slider.propTypes = {
  updateAmount: React.PropTypes.func,
  minRaise: React.PropTypes.number,
  myStack: React.PropTypes.number,
};

export default Slider;
