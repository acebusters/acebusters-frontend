import React from 'react';
import Link from '../../components/Link';

export const TRANSFER_NTZ = 'transfer_ntz';
export const TRANSFER_ETH = 'transfer_eth';
export const SELL_NTZ = 'sell_ntz';
export const ETH_PAYOUT = 'eth_payout';
export const PURCHASE_NTZ = 'pruchase_ntz';

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

export const notLoggedIn = {
  txId: 'AUTH_NOT_LOGGED_IN',
  notifyType: 'AUTH_NOT_LOGGED_IN',
  category: 'Visitor Mode',
  details: <span>Please <Link to="/login">login</Link> or <Link to="/register">signup</Link> to join a game</span>,
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'info',
};

export const firstLogin = {
  txId: 'LOGGING_IN',
  category: 'Logging in',
  details: 'First time it may take awhile',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'info',
};

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

export const exchangePending = {
  // txId: null,
  notifyType: 'TX_EXCHANGE_PENDING',
  category: 'Exchange Pending',
  details: null,
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'info',
};

export const exchangeSuccess = {
  // txId: temp, so no txId
  notifyType: 'TX_EXCHANGE_SUCCESS',
  category: 'Exchange Success',
  details: null,
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};

export const ethPayoutPending = {
  // txId: null,
  notifyType: 'TX_ETH_PAYOUT_PENDING',
  category: 'ETH Pay-Out',
  details: 'Processing ETH Pay-Out',
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'info',
};

export const ethPayoutSuccess = {
  // txId: temp, so no txId
  notifyType: 'TX_ETH_PAYOUT_SUCCESS',
  category: 'ETH Pay-Out',
  details: 'ETH Pay-Out completed successfuly',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};
