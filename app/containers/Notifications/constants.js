export const PERSIST = 'persist';
export const TEMP = 'temp';

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

export const temp = {
  notifyType: 'FUNDS_TRANSFERRED_NTZ',
  category: 'NTZ Wallet',
  details: 'Sent 1,000 NTZ to 0x2381...3290',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};

export const persist = {
  notifyType: 'TABLE_JOINING',
  category: 'Joining Table',
  details: '0xdsaifoj...dskafj',
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'danger',
};
