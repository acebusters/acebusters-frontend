import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../LoadingIndicator';

function LoadingButton(props) {
  const className = `${props.className} btn btn--loading`;
  return (
    <a href="" className={className} disabled="true">
      <LoadingIndicator />
    </a>
  );
}

LoadingButton.propTypes = {
  className: PropTypes.string,
};

export default LoadingButton;
