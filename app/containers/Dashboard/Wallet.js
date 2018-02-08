import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import web3Connect from '../AccountProvider/web3Connect';
import { NTZ_DECIMALS } from '../../utils/amountFormatter';
import { notifyCreate } from '../Notifications/actions';
import { TRANSFER_NTZ } from '../Notifications/constants';

import makeSelectAccountData from '../AccountProvider/selectors';
import messages from './messages';
import { getAmountUnit } from './selectors';

import WalletComponent from '../../components/Dashboard/Wallet';

import { ABI_TOKEN_CONTRACT, conf } from '../../app.config';

const confParams = conf();

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.handleNTZTransfer = this.handleNTZTransfer.bind(this);
    this.estimateNTZTransfer = this.estimateNTZTransfer.bind(this);

    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
  }

  handleTxSubmit(txFn) {
    return new Promise((resolve, reject) => {
      txFn((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  handleNTZTransfer(amount, to) {
    this.props.notifyCreate(TRANSFER_NTZ, { amount });
    return this.handleTxSubmit((callback) => {
      this.token.transfer.sendTransaction(
        to,
        new BigNumber(amount).mul(NTZ_DECIMALS),
        callback
      );
    });
  }

  estimateNTZTransfer(amount, to) {
    return this.token.transfer.estimateGas(to, new BigNumber(amount).mul(NTZ_DECIMALS));
  }

  render() {
    const { account } = this.props;
    const babzBalance = this.token.balanceOf(account.injected);

    return (
      <WalletComponent
        nutzBalance={babzBalance && babzBalance.div(NTZ_DECIMALS)}
        messages={messages}
        handleNTZTransfer={this.handleNTZTransfer}
        estimateNTZTransfer={this.estimateNTZTransfer}
      />
    );
  }
}
Wallet.propTypes = {
  account: PropTypes.object,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  amountUnit: getAmountUnit(),
});

export default web3Connect(
  mapStateToProps,
  () => ({
    notifyCreate,
  }),
)(Wallet);
