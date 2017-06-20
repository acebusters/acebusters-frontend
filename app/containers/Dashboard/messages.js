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
  ethAlert: {
    id: 'app.containers.Dashboard.ethAlert',
    defaultMessage: 'Never send real ether to this address. It is a Rinkeby Testnet Address. Only send Rinkaby TestEther to this Address. Otherwise your Ether will be lost',
  },
});
