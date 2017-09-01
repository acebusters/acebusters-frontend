import React from 'react';
import PropTypes from 'prop-types';
import A from 'components/A';
import { Icon } from 'containers/Dashboard/styles';
import Link from '../../components/Link';
import { conf } from '../../app.config';

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
 *  infoIcon: null | node
 * }
 */
const confParams = conf();

export const InfoIcon = ({ transactionHash }) => (
  <A
    href={`${confParams.etherscanUrl}tx/${transactionHash}`}
    target="_blank"
  >
    <Icon
      className="fa fa-info-circle"
      aria-hidden="true"
    />
  </A>
);
InfoIcon.propTypes = {
  transactionHash: PropTypes.string.isRequired,
};

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

export const txPending = {
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'info',
};

export const txSuccess = {
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'success',
};
