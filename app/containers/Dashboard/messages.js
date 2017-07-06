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
  included: {
    id: 'app.containers.Dashboard.included',
    defaultMessage: 'Transaction History:',
  },
  transactionErrorTitle: {
    id: 'app.containers.Dashboard.transactionErrorTitle',
    defaultMessage: 'Transaction error',
  },
  retryTransaction: {
    id: 'app.containers.Dashboard.retryTransaction',
    defaultMessage: 'Retry',
  },
  ethAlert: {
    id: 'app.containers.Dashboard.ethAlert',
    defaultMessage: 'Never send real ether to this address. It is a Rinkeby Testnet Address. Only send Rinkaby TestEther to this Address. Otherwise your Ether will be lost',
  },
  ntzTransferTitle: {
    id: 'app.containers.Dashboard.ntzTransferTitle',
    defaultMessage: 'Transfer NTZ',
  },
  ethTransferTitle: {
    id: 'app.containers.Dashboard.ethTransferTitle',
    defaultMessage: 'Transfer ETH',
  },
  powerUpTitle: {
    id: 'app.containers.Dashboard.powerUpTitle',
    defaultMessage: 'Power Up',
  },
  powerDownTitle: {
    id: 'app.containers.Dashboard.powerDownTitle',
    defaultMessage: 'Power Down',
  },
  sellTitle: {
    id: 'app.containers.Dashboard.sellTitle',
    defaultMessage: 'Sell NTZ',
  },
  purchaseTitle: {
    id: 'app.containers.Dashboard.purchaseTitle',
    defaultMessage: 'Purchase NTZ',
  },
  tableJoin: {
    id: 'app.containers.Dashboard.tableJoin',
    defaultMessage: 'Table join',
  },
  tableLeave: {
    id: 'app.containers.Dashboard.tableLeave',
    defaultMessage: 'Table leave',
  },
  sellStart: {
    id: 'app.containers.Dashboard.sellStart',
    defaultMessage: 'Sell start',
  },
  sellEnd: {
    id: 'app.containers.Dashboard.sellEnd',
    defaultMessage: 'Sell end',
  },
  purchaseStart: {
    id: 'app.containers.Dashboard.purchaseStart',
    defaultMessage: 'Purchase start',
  },
  purchaseEnd: {
    id: 'app.containers.Dashboard.purchaseEnd',
    defaultMessage: 'Purchase end',
  },
  nutzContract: {
    id: 'app.containers.Dashboard.nutzContract',
    defaultMessage: 'Nutz contract',
  },
  powerContract: {
    id: 'app.containers.Dashboard.powerContract',
    defaultMessage: 'Power contract',
  },
  me: {
    id: 'app.containers.Dashboard.me',
    defaultMessage: 'Nutz contract',
  },
  tableAddress: {
    id: 'app.containers.Dashboard.tableAddress',
    defaultMessage: 'Table {address}',
  },
  transferStatus: {
    id: 'app.containers.Dashboard.transferStatus',
    defaultMessage: 'Transfer',
  },
  powerUpStatus: {
    id: 'app.containers.Dashboard.powerUpStatus',
    defaultMessage: 'Power Up',
  },
});
