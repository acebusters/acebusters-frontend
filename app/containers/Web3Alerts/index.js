import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { makeSelectHasWeb3, makeSelectNetworkSupported, makeSelectWrongInjected } from '../../containers/AccountProvider/selectors';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import WrongInjectedMessage from '../Web3Alerts/WrongInjected';

const Web3Alerts = ({ hasWeb3, networkSupported, wrongInjected }) => {
  if (!hasWeb3) {
    return <NoWeb3Message />;
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
};

const mapStateToProps = createStructuredSelector({
  hasWeb3: makeSelectHasWeb3(),
  networkSupported: makeSelectNetworkSupported(),
  wrongInjected: makeSelectWrongInjected(),
});

export default connect(mapStateToProps)(Web3Alerts);
