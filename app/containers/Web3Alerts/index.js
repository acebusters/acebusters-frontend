import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import web3Connect from '../../containers/AccountProvider/web3Connect';
import { makeSelectHasWeb3, makeSelectNetworkSupported, makeSelectWrongInjected, makeSelectIsLocked } from '../../containers/AccountProvider/selectors';

import NoWeb3Message from '../Web3Alerts/NoWeb3';
import NoInjectedMessage from '../Web3Alerts/NoInjected';
import UnsupportedNetworkMessage from '../Web3Alerts/UnsupportedNetwork';
import WrongInjectedMessage from '../Web3Alerts/WrongInjected';
import PausedMessage from '../Web3Alerts/Paused';

import { conf, ABI_CONTROLLER_CONTRACT } from '../../app.config';

class Web3Alerts extends React.Component {
  constructor(props) {
    super(props);

    this.controller = this.web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(conf().contrAddr);
  }

  get web3() {
    return this.props.web3Redux.web3;
  }

  render() {
    const { hasWeb3, networkSupported, wrongInjected, isLocked } = this.props;
    const paused = !!this.controller.paused();

    if (paused) {
      return <PausedMessage />;
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
}

Web3Alerts.propTypes = {
  web3Redux: PropTypes.object,
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

export default web3Connect(mapStateToProps)(Web3Alerts);
