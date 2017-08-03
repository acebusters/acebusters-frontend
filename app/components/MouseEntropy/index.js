/* eslint no-multi-spaces: "off", key-spacing: "off", jsx-a11y/no-static-element-interactions: "off" */

import React from 'react';

import { byEightDirection, throttleSync } from './sampling';
import Bits from './bits';


const ST = {
  INITIAL:      0x0001,
  ACTIVE:       0x0002,
  DONE:         0x0003,
};

class MouseEntropy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bitCount: 0,
      bitData: new Bits([], 0, props.totalBits),
      status: ST.INITIAL,
    };

    this.collectMouseEntropy = throttleSync(byEightDirection, 50);
    this.onMouseMove  = this.onMouseMove.bind(this);
    this.onTouchMove  = this.onTouchMove.bind(this);
    this.reset        = this.reset.bind(this);
  }

  componentDidMount() {
    this.setEntropyCollector(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sampleRate !== this.props.sampleRate) {
      this.setEntropyCollector(newProps);
    }
  }

  onTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    this.onMove({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  onMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    this.onMove({
      x: e.clientX,
      y: e.clientY,
    });
  }

  onMove(pos) {
    if (this.state.status === ST.DONE) {
      return;
    }

    const oldBits = this.state.bitData;
    const bits    = this.collectMouseEntropy(pos);

    // Note: bits will be null if entropy factory take this move as useless
    if (!bits)  return;

    oldBits.appendBits(bits);

    if (oldBits.bitCount >= this.props.totalBits) {
      this.props.onFinish({
        raw: oldBits.bytes.slice(),
        text: oldBits.stringify(),
      });
    }

    this.setState({
      bitCount: oldBits.bitCount,
      status: oldBits.bitCount >= this.props.totalBits ? ST.DONE : ST.ACTIVE,
    });
  }

  setEntropyCollector(props = {}) {
    const { sampleRate } = props;

    if (sampleRate) {
      this.collectMouseEntropy = throttleSync(byEightDirection, sampleRate);
    }
  }

  reset() {
    this.props.onFinish(null);
    this.setState({
      status: ST.INITIAL,
      bitCount: 0,
      bitData: new Bits([], 0),
    });
  }

  render() {
    const {
      totalBits,
      width,
      height,
    } = this.props;
    const { bitCount, status }  = this.state;
    const percent = ((100 * bitCount) / totalBits).toFixed(2);
    const percentInt = percent.substr(0, percent.length - 3);
    const isReady = status === ST.DONE;

    return (
      <div style={{ width }}>
        <div
          role="button"
          tabIndex="0"
          onMouseMove={this.onMouseMove}
          onTouchMove={this.onTouchMove}
          style={{
            width,
            height,
            lineHeight: `${height}`,
            textAlign: 'center',
            background: isReady ? '#dfd' : '#ddd',
            color: isReady ? 'green' : 'black',
          }}
        >
          {isReady ?
            'Random secret successfully created!'
            :
            `Move mouse randomly in this area ${percentInt}/100%`
          }
        </div>
        <div tabIndex="-1" style={{ width: `${percent}%`, height: '3px', background: '#20dd66' }}></div>
      </div>
    );
  }
}

MouseEntropy.propTypes = {
  onFinish:   React.PropTypes.func.isRequired,
  totalBits:  React.PropTypes.number.isRequired,
  width:      React.PropTypes.string.isRequired,
  height:     React.PropTypes.string.isRequired,
  sampleRate: React.PropTypes.number.isRequired,
};

export default MouseEntropy;
