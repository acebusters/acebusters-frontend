import React from 'react';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

export const validateFloat = (messages, errors, amount, minAmount, maxAmount) => {
  const floatErrors = errors;
  const stringMinAmount = new BigNumber(String((minAmount || 0)));
  const stringMaxAmount = new BigNumber(maxAmount.toString());
  const stringAmount = amount ? new BigNumber(amount) : '0';

  if (!amount) {
    floatErrors.amount = <FormattedMessage {...messages.amountRequired} />;
  }
  if (stringMinAmount.gt(stringAmount)) {
    floatErrors.amount = <FormattedMessage {...messages.amountTooLow} values={{ minAmount }} />;
  }
  if (amount === '0') {
    floatErrors.amount = <FormattedMessage {...messages.amountZero} />;
  }
  if (stringMaxAmount && stringMaxAmount.lt(stringAmount)) {
    floatErrors.amount = <FormattedMessage {...messages.amountTooHigh} values={{ maxAmount }} />;
  }

  return floatErrors;
};
