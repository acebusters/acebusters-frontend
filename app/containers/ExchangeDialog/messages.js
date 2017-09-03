import { defineMessages } from 'react-intl';

export default defineMessages({
  amountRequired: {
    id: 'app.containers.ExchangeDialog.amountRequired',
    defaultMessage: 'The amount field cannot be empty',
  },
  amountTooLow: {
    id: 'app.containers.ExchangeDialog.amountTooLow',
    defaultMessage: 'The amount must be greater than {minAmount}',
  },
  amountTooHigh: {
    id: 'app.containers.ExchangeDialog.amountTooHigh',
    defaultMessage: 'The amount must be less than or equal to {maxAmount}',
  },
  amountZero: {
    id: 'app.containers.ExchangeDialog.amountZero',
    defaultMessage: 'The amount must be greater than 0',
  },
  expectedAmount: {
    id: 'app.containers.ExchangeDialog.expectedAmount',
    defaultMessage: 'Receive: {amount}',
  },
  sellTitle: {
    id: 'app.containers.ExchangeDialog.sellTitle',
    defaultMessage: 'Sell Amount',
  },
  submitButton: {
    id: 'app.containers.ExchangeDialog.submitButton',
    defaultMessage: 'Submit',
  },
});
