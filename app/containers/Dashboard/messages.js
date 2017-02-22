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
    defaultMessage: 'Mined Transactions:',
  },
});
