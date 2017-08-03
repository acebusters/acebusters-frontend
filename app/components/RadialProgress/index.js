/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import styled from 'styled-components';
import enhancer from './enhancer';

const Wrapper = styled.div`
  position: relative;
  border-radius: 50%;
  background-image: url(${(props) => props.bgImg});
`;

const Label = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
`;

class Radial extends Component {
  getPathStyles() {
    const { percent, strokeWidth, gapDegree = 0, gapPosition } = this.props;
    const radius = 50 - (strokeWidth / 2);
    let beginPositionX = 0;
    let beginPositionY = -radius;
    let endPositionX = 0;
    let endPositionY = -2 * radius;
    switch (gapPosition) {
      case 'left':
        beginPositionX = -radius;
        beginPositionY = 0;
        endPositionX = 2 * radius;
        endPositionY = 0;
        break;
      case 'right':
        beginPositionX = radius;
        beginPositionY = 0;
        endPositionX = -2 * radius;
        endPositionY = 0;
        break;
      case 'bottom':
        beginPositionY = radius;
        endPositionY = 2 * radius;
        break;
      default:
    }
    const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
     a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
     a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
    const len = Math.PI * 2 * radius;
    const trailPathStyle = {
      strokeDasharray: `${len - gapDegree}px ${len}px`,
      strokeDashoffset: `-${gapDegree / 2}px`,
      transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
    };
    const strokePathStyle = {
      strokeDasharray: `${(percent / 100) * (len - gapDegree)}px ${len}px`,
      strokeDashoffset: `-${gapDegree / 2}px`,
      transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
    };
    return { pathString, trailPathStyle, strokePathStyle };
  }

  render() {
    const {
      prefixCls, strokeWidth, trailWidth, strokeColor,
      trailColor, strokeLinecap, style, bgImg, className, ...restProps
    } = this.props;
    const { pathString, trailPathStyle, strokePathStyle } = this.getPathStyles();
    delete restProps.percent;
    delete restProps.gapDegree;
    delete restProps.gapPosition;
    return (
      <Wrapper bgImg={bgImg}>
        <Label> { this.props.label } </Label>
        <svg
          className={`${prefixCls}-circle ${className}`}
          viewBox="0 0 100 100"
          style={style}
          {...restProps}
        >
          <path
            className={`${prefixCls}-circle-trail`}
            d={pathString}
            stroke={trailColor}
            strokeWidth={trailWidth || strokeWidth}
            fillOpacity="0"
            style={trailPathStyle}
          />
          <path
            className={`${prefixCls}-circle-path`}
            d={pathString}
            strokeLinecap={strokeLinecap}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fillOpacity="0"
            ref={(path) => { this.path = path; }}
            style={strokePathStyle}
          />
        </svg>
      </Wrapper>
    );
  }
}

Radial.PropTypes = {
  className: React.PropTypes.string,
  percent: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  prefixCls: React.PropTypes.string,
  strokeColor: React.PropTypes.string,
  strokeLinecap: React.PropTypes.oneOf(['round', 'square']),
  strokeWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  style: React.PropTypes.object,
  trailColor: React.PropTypes.string,
  trailWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  gapPosition: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

Radial.defaultProps = {
  className: '',
  percent: 0,
  prefixCls: 'rc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  style: {},
  trailColor: '#D9D9D9',
  trailWidth: 1,
  gapPosition: 'top',
};

export default enhancer(Radial);
