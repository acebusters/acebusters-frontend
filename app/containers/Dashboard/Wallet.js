import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import web3Connect from '../AccountProvider/web3Connect';
import { ETH_DECIMALS, NTZ_DECIMALS } from '../../utils/amountFormatter';
import { notifyCreate } from '../Notifications/actions';
import { TRANSFER_NTZ, TRANSFER_ETH } from '../Notifications/constants';

import { modalDismiss } from '../App/actions';
import makeSelectAccountData from '../AccountProvider/selectors';
import messages from './messages';
import { getAmountUnit } from './selectors';

import WalletComponent from '../../components/Dashboard/Wallet';

import { ABI_TOKEN_CONTRACT, ABI_PROXY, conf } from '../../app.config';

const confParams = conf();

class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.handleNTZTransfer = this.handleNTZTransfer.bind(this);
    this.estimateNTZTransfer = this.estimateNTZTransfer.bind(this);
    this.handleETHTransfer = this.handleETHTransfer.bind(this);
    this.estimateETHTransfer = this.estimateETHTransfer.bind(this);

    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    if (props.account.proxy) {
      this.proxy = this.web3.eth.contract(ABI_PROXY).at(props.account.proxy);
    }

    this.fishWarn = this.fishWarn.bind(this);
    this.state = {
      isFishWarned: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { account } = this.props;
    const { account: nextAccount } = nextProps;

    if (account.proxy === undefined && nextAccount.proxy) {
      this.proxy = this.web3.eth.contract(ABI_PROXY).at(nextAccount.account.proxy);
    }
  }

  fishWarn() {
    this.setState({ isFishWarned: true });
  }

  handleTxSubmit(txFn) {
    return new Promise((resolve, reject) => {
      txFn((err, result) => {
        this.props.modalDismiss();
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

  handleETHTransfer(amount, to) {
    this.props.notifyCreate(TRANSFER_ETH, { amount });
    return this.handleTxSubmit((callback) => {
      this.proxy.forward.sendTransaction(
        to,
        new BigNumber(amount).mul(ETH_DECIMALS),
        '',
        callback
      );
    });
  }

  estimateETHTransfer(amount, to) {
    return this.proxy.forward.estimateGas(to, new BigNumber(amount).mul(ETH_DECIMALS), '');
  }

  render() {
    const { account, amountUnit } = this.props;
    const { isFishWarned } = this.state;
    const qrUrl = `ether:${account.proxy}`;
    const weiBalance = this.web3.eth.balance(account.proxy);
    const ethBalance = weiBalance && weiBalance.div(ETH_DECIMALS);
    const babzBalance = this.token.balanceOf(account.proxy);
    const nutzBalance = babzBalance && babzBalance.div(NTZ_DECIMALS);
    const floor = this.token.floor();

    return (
      <WalletComponent
        {...{
          account,
          floor,
          ethBalance,
          nutzBalance,
          qrUrl,
          messages,
          isFishWarned,
          handleNTZTransfer: this.handleNTZTransfer,
          estimateNTZTransfer: this.estimateNTZTransfer,
          handleETHTransfer: this.handleETHTransfer,
          estimateETHTransfer: this.estimateETHTransfer,
          fishWarn: this.fishWarn,
          amountUnit,
        }}
      />
    );
  }
}
Wallet.propTypes = {
  account: PropTypes.object,
  modalDismiss: PropTypes.func,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func,
  amountUnit: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
  notifyCreate: (type, props) => dispatch(notifyCreate(type, props)),
  modalDismiss,
});

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  amountUnit: getAmountUnit(),
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wallet);

