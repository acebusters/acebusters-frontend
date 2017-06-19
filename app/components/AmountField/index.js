import React, { PropTypes } from 'react';
import { Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';

const AmountField = ({
  maxAmount,
  ...props
}) => {
  const limitAmount = (value) => {
    const numValue = Math.max(0, Number(value));

    return maxAmount.gte(new BigNumber(numValue)) ? numValue : maxAmount.toNumber();
  };

  return (
    <Field
      type="number"
      normalize={maxAmount && limitAmount}
      {...props}
    />
  );
};

AmountField.propTypes = {
  maxAmount: PropTypes.object,
};

export default AmountField;
