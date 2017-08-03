export const TRANSFER_NTZ = 'transfer_ntz';
export const TRANSFER_ETH = 'transfer_eth';

/**
 * type Notification = {
 *  txId: string;
 *  notifyType: string;
 *  category: string;
 *  details: string
 *  removing: boolean;
 *  dismissable: boolean;
 *  date: Date;
 *  type: 'success' | 'info' | 'warning' | 'danger';
 * }
 */

export const loggedInSuccess = {
  txId: 'AUTH_LOGGED_IN',
  notifyType: 'AUTH_LOGGED_IN',
  category: 'Account Auth Success',
  details: 'Good luck!',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};

export const noWeb3Danger = {
  txId: 'NO_WEB3_MESSAGE',
  notifyType: 'ACCOUNT_LOADED',
  category: 'Browser doesn\'t support smart contracts!',
  details: 'Install MetaMask or ethereum browser',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'danger',
};

export const transferPending = {
  // txId: null,
  notifyType: 'TX_TRANSFER_PENDING',
  category: 'Transfer Pending',
  details: null,
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'info',
};

export const transferSuccess = {
  // txId: temp, so no txId
  notifyType: 'TX_TRANSFER_SUCCESS',
  category: 'Transfer Success',
  details: null,
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};
