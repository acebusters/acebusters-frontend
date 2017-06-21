import React from 'react';

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
  amountToCall: React.PropTypes.number,
  handleFold: React.PropTypes.func,
};

export default ControlFold;
