/*
 * Dashboard Messages
 *
 * This contains all the text for the Dashboard component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.Dashboard.header',
    defaultMessage: 'Account Dashboard',
  },
  pending: {
    id: 'app.containers.Dashboard.pending',
    defaultMessage: 'Pending Transactions:',
  },
  included: {
    id: 'app.containers.Dashboard.included',
    defaultMessage: 'Transaction History:',
  },
  panes: {
    nutz: {
      id: 'app.containers.Dashboard.panes.nutz',
      defaultMessage: 'Nutz Wallet',
    },
    power: {
      id: 'app.containers.Dashboard.panes.power',
      defaultMessage: 'Power Wallet',
    },
    transactions: {
      id: 'app.containers.Dashboard.panes.transactions',
      defaultMessage: 'Transactions',
    },
  },
});
