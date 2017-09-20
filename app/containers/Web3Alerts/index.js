import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { makeSelectHasWeb3, makeSelectNetworkSupported, makeSelectWrongInjected, makeSelectIsLocked } from '../../containers/AccountProvider/selectors';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import NoInjectedMessage from '../Web3Alerts/NoInjected';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import WrongInjectedMessage from '../Web3Alerts/WrongInjected';

const Web3Alerts = ({ hasWeb3, networkSupported, wrongInjected, isLocked }) => {
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
};

Web3Alerts.propTypes = {
  hasWeb3: PropTypes.bool,
  networkSupported: PropTypes.bool,
  wrongInjected: PropTypes.bool,
  isLocked: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
  wrongInjected: makeSelectWrongInjected(),
  isLocked: makeSelectIsLocked(),
});

export default connect(mapStateToProps)(Web3Alerts);
