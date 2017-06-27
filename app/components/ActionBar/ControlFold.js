import React from 'react';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';

const ControlFold = (props) => {
  const {
    amountToCall,
    handleFold,
  } = props;
  if (amountToCall > 0) {
    return (
      <ActionButton
        name="button-fold"
        text="Fold"
        type="FOLD"
        handleClick={() => handleFold()}
        {...props}
      />
    );
  }
  return <ControlBlank {...props} />;
};
ControlFold.propTypes = {
  amountToCall: PropTypes.number,
  handleFold: PropTypes.func,
};

export default ControlFold;
