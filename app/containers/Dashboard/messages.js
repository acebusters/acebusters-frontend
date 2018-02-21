/*
 * Dashboard Messages
 *
 * This contains all the text for the Dashboard component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  advanced: {
    id: 'app.containers.Dashboard.advanced',
    defaultMessage: 'Advanced',
  },
  amount: {
    id: 'app.containers.Dashboard.amount',
    defaultMessage: 'Amount',
  },
  amountRequired: {
    id: 'app.containers.Dashboard.amountRequired',
    defaultMessage: 'The amount field cannot be empty',
  },
  amountTooLow: {
    id: 'app.containers.Dashboard.amountTooLow',
    defaultMessage: 'The amount must be greater than {minAmount}',
  },
  amountTooHigh: {
    id: 'app.containers.Dashboard.amountTooHigh',
    defaultMessage: 'The amount must be less than or equal to {maxAmount}',
  },
  amountZero: {
    id: 'app.containers.Dashboard.amountZero',
    defaultMessage: 'The amount must be greater than 0',
  },
  ok: {
    id: 'app.containers.Dashboard.ok',
    defaultMessage: 'Ok',
  },
  overview: {
    id: 'app.containers.Dashboard.overview',
    defaultMessage: 'Overview',
  },
  header: {
    id: 'app.containers.Dashboard.header',
    defaultMessage: 'Account Dashboard',
  },
  included: {
    id: 'app.containers.Dashboard.included',
    defaultMessage: 'Transaction History',
  },
  ethPayout: {
    id: 'app.containers.Dashboard.ethPayout',
    defaultMessage: 'ETH Payout',
  },
  transactionErrorTitle: {
    id: 'app.containers.Dashboard.transactionErrorTitle',
    defaultMessage: 'Transaction error',
  },
  retryTransaction: {
    id: 'app.containers.Dashboard.retryTransaction',
    defaultMessage: 'Retry',
  },
  tableJoin: {
    id: 'app.containers.Dashboard.tableJoin',
    defaultMessage: 'Table join',
  },
  tableLeave: {
    id: 'app.containers.Dashboard.tableLeave',
    defaultMessage: 'Table leave',
  },
  acebusters: {
    id: 'app.containers.Dashboard.acebusters',
    defaultMessage: 'Acebusters',
  },
  me: {
    id: 'app.containers.Dashboard.me',
    defaultMessage: 'Me',
  },
  tableAddress: {
    id: 'app.containers.Dashboard.tableAddress',
    defaultMessage: 'Table {address}',
  },
});
