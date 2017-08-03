import React from 'react';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';

import { CALL, CHECK } from '../../containers/ActionBar/actions';

const ControlCheckCall = (props) => {
  const {
    amountToCall,
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
        type={CALL}
        {...props}
      />
    );
  }
  if (amountToCall === 0) {
    return (
      <ActionButton
        name="button-check"
        text="Check"
        type={CHECK}
        {...props}
      />
    );
  }
  return <ControlBlank {...props} />;
};
ControlCheckCall.propTypes = {
  amountToCall: PropTypes.number,
  myStack: PropTypes.number,
};

export default ControlCheckCall;
