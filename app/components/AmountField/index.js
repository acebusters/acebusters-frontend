import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import BigNumber from 'bignumber.js';

const AmountField = ({
  maxAmount,
  minAmount = 0,
  ...props
}) => {
  const limitAmount = (value) => BigNumber.min(
    BigNumber.max(minAmount, value || 0),
    maxAmount,
  ).toNumber();

  return (
    <Field
      normalize={maxAmount && limitAmount}
      {...props}
    />
  );
};

AmountField.propTypes = {
  maxAmount: PropTypes.object,
  minAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

export default AmountField;
