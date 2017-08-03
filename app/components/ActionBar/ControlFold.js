import React from 'react';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import ControlBlank from './ControlBlank';
import { FOLD } from '../../containers/ActionBar/actions';

const ControlFold = (props) => {
  const {
    amountToCall,
  } = props;
  if (amountToCall > 0) {
    return (
      <ActionButton
        name="button-fold"
        text="Fold"
        type={FOLD}
        {...props}
      />
    );
  }
  return <ControlBlank {...props} />;
};
ControlFold.propTypes = {
  amountToCall: PropTypes.number,
};

export default ControlFold;
