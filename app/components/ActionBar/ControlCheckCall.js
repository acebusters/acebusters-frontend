import React from 'react';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';


const ControlCheckCall = (props) => {
  const {
    amountToCall,
    handleCall,
    handleCheck,
    myStack,
  } = props;
  if (amountToCall > myStack) {
    return <ControlBlank {...props} />;
  }
  if (amountToCall > 0) {
    return (
      <ActionButton
        name="button-call"
        text="Call"
        type="CALL"
        handleClick={() => handleCall()}
        {...props}
      />
    );
  }
  if (amountToCall === 0) {
    return (
      <ActionButton
        name="button-check"
        text="Check"
        type="CHECK"
        handleClick={() => handleCheck()}
        {...props}
      />
    );
  }
  return <ControlBlank {...props} />;
};
ControlCheckCall.propTypes = {
  amountToCall: React.PropTypes.number,
  handleCall: React.PropTypes.func,
  handleCheck: React.PropTypes.func,
  myStack: React.PropTypes.number,
};

export default ControlCheckCall;
