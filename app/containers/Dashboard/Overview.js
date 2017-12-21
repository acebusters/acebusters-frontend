import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import web3Connect from '../AccountProvider/web3Connect';
import { getWeb3 } from '../AccountProvider/sagas';
import { waitForTx } from '../../utils/waitForTx';
import { notifyCreate } from '../Notifications/actions';
import { ETH_PAYOUT } from '../Notifications/constants';

import makeSelectAccountData from '../AccountProvider/selectors';
import { toggleInvestTour } from './actions';
import messages from './messages';
import { txnsToList } from './txnsToList';
import {
  createDashboardTxsSelector,
  createPendingETHPayoutSelector,
  createPendingABPPayoutSelector,
} from './selectors';

import OverviewComponent from '../../components/Dashboard/Overview';

import {
  ABI_CONTROLLER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  ABI_TABLE_FACTORY,
  ABI_PULL_PAYMENT_CONTRACT,
  conf,
} from '../../app.config';

const confParams = conf();

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.handleETHPayout = this.handleETHPayout.bind(this);
    this.estimateETHPayout = this.estimateETHPayout.bind(this);
    this.handleABPPayout = this.handleABPPayout.bind(this);
    this.estimateABPPayout = this.estimateABPPayout.bind(this);

    this.web3 = props.web3Redux.web3;
    this.controller = this.web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(confParams.contrAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.power = this.web3.eth.contract(ABI_POWER_CONTRACT).at(confParams.pwrAddr);
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);
    this.pullPayment = this.web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(confParams.pullAddr);

    this.tableFactory.getTables.call();
  }

  async handleETHPayout(amount) {
    this.props.notifyCreate(ETH_PAYOUT, { amount });
    this.pullPayment.withdraw.sendTransaction({ from: this.props.account.proxyAddr });
  }

  estimateETHPayout() {
    return this.pullPayment.withdraw.estimateGas({ from: this.props.account.proxyAddr });
  }

  handleABPPayout() {
    const { account } = this.props;
    this.power.downTick.sendTransaction(account.proxy, (err, txHash) => {
      if (txHash) {
        waitForTx(getWeb3(), txHash).then(() => this.power.downs.call(account.proxy));
      }
    });
  }

  estimateABPPayout() {
    const { account } = this.props;
    return this.power.downTick.estimateGas(account.proxy);
  }

  render() {
    const { account } = this.props;
    const totalSupplyPwr = this.power.totalSupply();
    const downtime = this.power.downtime();
    const completeSupplyBabz = this.controller.completeSupply();
    const activeSupplyPwr = this.power.activeSupply();
    const activeSupplyBabz = this.token.activeSupply();
    const babzBalance = this.token.balanceOf(account.proxy);
    const pwrBalance = this.power.balanceOf(account.proxy);
    const downs = this.power.downs(account.proxy);
    const [ethAllowance, ethPayoutDate] = this.pullPayment.paymentOf(account.proxy) || [];
    const tables = this.tableFactory.getTables();
    const listTxns = txnsToList(
      this.props.dashboardTxs,
      tables,
      account.proxy
    );
    return (
      <OverviewComponent
        {...{
          account,
          messages,
          babzBalance,
          ethAllowance,
          ethPayoutDate,
          ethPayoutPending: this.props.pendingETHPayout,
          abpPayoutPending: this.props.pendingABPPayout,
          pwrBalance,
          completeSupplyBabz,
          activeSupplyPwr,
          activeSupplyBabz,
          listTxns,
          downtime,
          totalSupplyPwr,
          toggleInvestTour: this.props.toggleInvestTour,
          downs: downs && [...downs],
          handleETHPayout: this.handleETHPayout,
          estimateETHPayout: this.estimateETHPayout,
          handleABPPayout: this.handleABPPayout,
          estimateABPPayout: this.estimateABPPayout,
        }}
      />
    );
  }
}
Overview.propTypes = {
  account: PropTypes.object,
  pendingETHPayout: PropTypes.bool,
  pendingABPPayout: PropTypes.bool,
  dashboardTxs: PropTypes.array,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func,
  toggleInvestTour: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  toggleInvestTour,
  notifyCreate: (type, props) => dispatch(notifyCreate(type, props)),
});

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  dashboardTxs: createDashboardTxsSelector(),
  pendingETHPayout: createPendingETHPayoutSelector(),
  pendingABPPayout: createPendingABPPayoutSelector(),
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(Overview);

