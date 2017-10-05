/* eslint no-multi-spaces: "off", key-spacing: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import { keyframes } from 'styled-components';

const spinnerAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const defaultBlockStyle = {
  outer: {},
  inner: {
    display: 'block',
    position: 'relative',
    width: '100%',
    height: '100px',
  },
  layout: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
  },
  spinner: {
    width: '30px',
    height: '30px',
    fontSize: '30px',
    animation: `${spinnerAnimation} 1s linear infinite`,
  },
};

const defaultInlineStyle = {
  outer: {},
  inner: {},
  layout: {},
  spinner: {
    animation: `${spinnerAnimation} 1s linear infinite`,
  },
};


const WithLoading = ({ children, isLoading, loadingSize, type = 'block', styles = {} }) => {
  const defaultStyle  = type === 'inline' ? defaultInlineStyle : defaultBlockStyle;
  const outerStyle    = Object.assign({}, defaultStyle.outer, styles.outer || {});
  const innerStyle    = Object.assign({}, defaultStyle.inner, styles.inner || {});
  const layoutStyle   = Object.assign({}, defaultStyle.layout, styles.layout || {});
  const spinnerStyle  = Object.assign(
    {},
    defaultStyle.spinner,
    loadingSize ? {
      width: loadingSize,
      height: loadingSize,
      fontSize: loadingSize,
    } : {},
    styles.spinner || {}
  );

  const display = () => {
    if (isLoading) {
      return (
        <span style={innerStyle}>
          <span style={layoutStyle}>
            <span className="fa fa-circle-o-notch" style={spinnerStyle}></span>
          </span>
        </span>
      );
    }

    return children;
  };

  return (
    <span style={outerStyle}>
      {display()}
    </span>
  );
};

WithLoading.propTypes = {
  children: PropTypes.node,
  isLoading:  PropTypes.bool.isRequired,
  loadingSize: PropTypes.string,
  type:  PropTypes.string,
  styles:  PropTypes.object,
};

export default WithLoading;
