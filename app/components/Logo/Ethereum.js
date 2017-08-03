import React from 'react';
import PropTypes from 'prop-types';

const Ethereum = ({ width, height }) => (
  <svg
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 510 829"
    aria-labelledby="ethereum"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="ethereum-logo">Ethereum Logo</title>
    <g id="ethereum" fill="#010101">
      <g id="Group" opacity="0.6" transform="translate(0.000000, 306.000000)">
        <polygon id="Shape" points="255 0.4 0.6 116.1 255 266.4 509.3 116.1"></polygon>
      </g>
      <g id="Group" opacity="0.45">
        <polygon id="Shape" points="0.6 422.1 255 572.4 255 0"></polygon>
      </g>
      <g id="Group" opacity="0.8" transform="translate(255.000000, 0.000000)">
        <polygon id="Shape" points="0 0 0 572.4 254.3 422.1"></polygon>
      </g>
      <g id="Group" opacity="0.45" transform="translate(0.000000, 470.000000)">
        <polygon id="Shape" points="0.6 0.3 255 358.7 255 150.6"></polygon>
      </g>
      <g id="Group" opacity="0.8" transform="translate(255.000000, 470.000000)">
        <polygon id="Shape" points="0 150.6 0 358.7 254.5 0.3"></polygon>
      </g>
    </g>
  </svg>
);
Ethereum.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default Ethereum;
