import React from 'react';
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
  className: React.PropTypes.string,
};

export default LoadingButton;
