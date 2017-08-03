import React from 'react';
import PropTypes from 'prop-types';

const Nutz = ({ width, height }) => (
  <svg
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 228 450"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="nutz-logo">Nutz Logo</title>
    <g id="Page-1" stroke="none" fill="none">
      <g id="Nutz" fill="#FF5C5C">
        <polygon id="Shape" points="207.8 240 207.8 121.3 114 66.3 20.3 121.3 20.3 240 114 240"></polygon>
        <polygon id="Shape" points="114 253.7 0.3 253.7 0.3 328.7 114 383.7 114 383.7 227.8 328.7 227.8 253.7"></polygon>
        <polygon id="Shape" points="119.4 395 114 397.6 108.6 395 97.7 389.8 88.4 450 139.6 450 130.3 389.8"></polygon>
        <polygon id="Shape" points="108.6 55 114 52.4 119.4 55 130.3 60.2 139.6 0 88.4 0 97.7 60.2"></polygon>
      </g>
    </g>
  </svg>
);
Nutz.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default Nutz;
