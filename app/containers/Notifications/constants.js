import React from 'react';
import PropTypes from 'prop-types';
import A from 'components/A';
import { Icon } from 'containers/Dashboard/styles';
import { conf } from '../../app.config';

export const ETH_PAYOUT = 'eth_payout';

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

export const noWeb3Danger = {
  txId: 'NO_WEB3_MESSAGE',
  notifyType: 'NO_WEB3_MESSAGE',
  category: 'Browser doesn\'t support smart contracts!',
  details: 'Install MetaMask or ethereum browser',
  removing: false,
  dismissable: true,
  date: new Date(),
  type: 'danger',
};

export const noConnectionDanger = {
  txId: 'NO_CONNECTION_MESSAGE',
  notifyType: 'NO_CONNECTION_MESSAGE',
  category: 'Connection lost',
  details: (<p>
    Please check your connection or try{' '}
    <a
      role="button"
      tabIndex={-1}
      onClick={() => window.location.reload()}
      style={{
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      to refresh page
    </a>
  </p>),
  removing: false,
  dismissable: false,
  date: new Date(),
  type: 'danger',
};
