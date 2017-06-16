import React from 'react';
import RCSlider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

import { SliderWrapper } from './styles';

const styles = {
  handle: {
    position: 'absolute',
    width: '34px',
    height: '50px',
    marginLeft: '-12px',
    marginTop: '-20px',
    cursor: 'pointer',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    border: 'none',
    backgroundColor: '#999',
  },
  rail: {
    backgroundColor: '#333',
    height: '6px',
  },
  track: {
    backgroundColor: '#333',
    height: '6px',
  },
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
          handleStyle={styles.handle}
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
