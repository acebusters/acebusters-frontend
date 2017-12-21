import React from 'react';
import { SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import BigNumber from 'bignumber.js';

import { modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { ETH_DECIMALS, NTZ_DECIMALS } from '../../utils/amountFormatter';
import { SELL_NTZ, PURCHASE_NTZ, ETH_PAYOUT } from '../Notifications/constants';
import { notifyCreate } from '../Notifications/actions';

import makeSelectAccountData from '../AccountProvider/selectors';

import ExchangeComponent from '../../components/Dashboard/Exchange';
import { ABI_TOKEN_CONTRACT, ABI_PULL_PAYMENT_CONTRACT, conf } from '../../app.config';

import { ETH, NTZ } from './actions';
import messages from './messages';
import { getAmountUnit, createPendingETHPayoutSelector } from './selectors';

const confParams = conf();

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.handleNTZPurchase = this.handleNTZPurchase.bind(this);
    this.estimateNTZPurchase = this.estimateNTZPurchase.bind(this);
    this.handleNTZSell = this.handleNTZSell.bind(this);
    this.estimateNTZSell = this.estimateNTZSell.bind(this);
    this.handleETHPayout = this.handleETHPayout.bind(this);
    this.estimateETHPayout = this.estimateETHPayout.bind(this);

    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.pullPayment = this.web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(confParams.pullAddr);
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

  async handleNTZSell(amount) {
    this.props.notifyCreate(SELL_NTZ, { amount });

    const floor = await this.token.floor.callPromise();

    if (!floor.eq(this.token.floor())) {
      this.token.floor.call();
      throw new SubmissionError({
        amount: 'Floor price was changed',
      });
    }

    return this.handleTxSubmit((callback) => {
      this.token.sell.sendTransaction(
        floor,
        new BigNumber(amount).mul(NTZ_DECIMALS),
        { from: this.props.account.proxy },
        callback
      );
    });
  }

  estimateNTZSell(amount) {
    const floor = this.token.floor();
    return this.token.sell.estimateGas(
      floor,
      new BigNumber(amount).mul(NTZ_DECIMALS),
      { from: this.props.account.proxy },
    );
  }

  async handleNTZPurchase(amount) {
    this.props.notifyCreate(PURCHASE_NTZ, { amount });

    const ceiling = await this.token.ceiling.callPromise();

    if (!ceiling.eq(this.token.ceiling())) {
      this.token.ceiling.call();
      throw new SubmissionError({
        amount: 'Ceiling was changed',
      });
    }

    return this.handleTxSubmit((callback) => {
      this.token.purchase.sendTransaction(
        ceiling,
        {
          from: this.props.account.proxy,
          value: new BigNumber(amount).mul(ETH_DECIMALS),
        },
        callback
      );
    });
  }

  estimateNTZPurchase(amount) {
    const ceiling = this.token.ceiling();

    return this.token.purchase.estimateGas(
      ceiling,
      {
        from: this.props.account.proxy,
        value: new BigNumber(amount).mul(ETH_DECIMALS),
      },
    );
  }

  async handleETHPayout(amount) {
    this.props.notifyCreate(ETH_PAYOUT, { amount });
    this.pullPayment.withdraw.sendTransaction({ from: this.props.account.proxyAddr });
  }

  estimateETHPayout() {
    return this.pullPayment.withdraw.estimateGas({ from: this.props.account.proxyAddr });
  }

  render() {
    const { account, amountUnit } = this.props;
    const weiBalance = this.web3.eth.balance(account.proxy);
    const babzBalance = this.token.balanceOf(account.proxy);
    const [ethAllowance, ethPayoutDate] = this.pullPayment.paymentOf(account.proxy) || [];

    return (
      <ExchangeComponent
        {...{
          account,
          amountUnit,
          floor: this.token.floor(),
          ceiling: this.token.ceiling(),
          ethBalance: weiBalance && weiBalance.div(ETH_DECIMALS),
          nutzBalance: babzBalance && babzBalance.div(NTZ_DECIMALS),
          messages,
          handleNTZSell: this.handleNTZSell,
          estimateNTZSell: this.estimateNTZSell,
          handleNTZPurchase: this.handleNTZPurchase,
          estimateNTZPurchase: this.estimateNTZPurchase,

          ethAllowance,
          ethPayoutDate,
          ethPayoutPending: this.props.pendingETHPayout,
          handleETHPayout: this.handleETHPayout,
          estimateETHPayout: this.estimateETHPayout,
        }}
      />
    );
  }
}
Exchange.propTypes = {
  amountUnit: PropTypes.oneOf([ETH, NTZ]),
  account: PropTypes.object,
  pendingETHPayout: PropTypes.bool,
  modalDismiss: PropTypes.func.isRequired,
  web3Redux: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  pendingETHPayout: createPendingETHPayoutSelector(),
  amountUnit: getAmountUnit(),
});

export default web3Connect(
  mapStateToProps,
  () => ({ notifyCreate, modalDismiss }),
)(Exchange);
