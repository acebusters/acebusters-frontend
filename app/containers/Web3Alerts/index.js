import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectHasWeb3,
  makeSelectNetworkSupported,
  makeSelectWrongInjected,
  makeSelectIsLocked,
  makeSelectWeb3MethodValue,
  makeSelectIsWeb3Connected,
} from '../../containers/AccountProvider/selectors';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import NoInjectedMessage from '../Web3Alerts/NoInjected';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import WrongInjectedMessage from '../Web3Alerts/WrongInjected';
import PausedMessage from '../Web3Alerts/Paused';
import NotConnectedMessage from '../Web3Alerts/NotConnected';

import { conf } from '../../app.config';

function Web3Alerts({
  hasWeb3,
  networkSupported,
  wrongInjected,
  isLocked,
  isConnected,
  paused,
}) {
  if (paused) {
    return <PausedMessage />;
  }

  if (!isConnected) {
    return <NotConnectedMessage />;
  }

  if (isLocked) {
    return null;
  }

  if (!window.web3) {
    return <NoWeb3Message />;
  }

  if (!hasWeb3) {
    return <NoInjectedMessage />;
  }

  if (!networkSupported) {
    return <UnsupportedNetworkMessage />;
  }

  if (wrongInjected) {
    return <WrongInjectedMessage />;
  }

  return null;
}

Web3Alerts.propTypes = {
  hasWeb3: PropTypes.bool,
  networkSupported: PropTypes.bool,
  wrongInjected: PropTypes.bool,
  isLocked: PropTypes.bool,
  paused: PropTypes.bool,
  isConnected: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
  wrongInjected: makeSelectWrongInjected(),
  isLocked: makeSelectIsLocked(),
  isConnected: makeSelectIsWeb3Connected(),
  paused: makeSelectWeb3MethodValue(conf().contrAddr, 'paused'),
});

export default connect(mapStateToProps)(Web3Alerts);
