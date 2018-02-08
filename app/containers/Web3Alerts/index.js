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

import PausedMessage from '../Web3Alerts/Paused';
import NotConnectedMessage from '../Web3Alerts/NotConnected';

import { conf } from '../../app.config';

function Web3Alerts({ isConnected, paused }) {
  if (paused) {
    return <PausedMessage />;
  }

  if (!isConnected) {
    return <NotConnectedMessage />;
  }

  return null;
}

Web3Alerts.propTypes = {
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
