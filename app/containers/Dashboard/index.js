import React from 'react';
import { SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

import InvestTour from '../../components/Dashboard/InvestTour';

import web3Connect from '../AccountProvider/web3Connect';
import { getWeb3 } from '../AccountProvider/sagas';
import { addEventsDate, isUserEvent } from '../AccountProvider/utils';
import {
  ETH_DECIMALS,
  NTZ_DECIMALS,
  ABP_DECIMALS,
} from '../../utils/amountFormatter';
import { waitForTx } from '../../utils/waitForTx';
import { notifyCreate } from '../Notifications/actions';
import {
  TRANSFER_NTZ,
  TRANSFER_ETH,
  SELL_NTZ,
  PURCHASE_NTZ,
  ETH_PAYOUT,
} from '../Notifications/constants';

import { modalAdd, modalDismiss } from '../App/actions';
import { contractEvents, accountLoaded, proxyEvents } from '../AccountProvider/actions';
import makeSelectAccountData, {
  makeSignerAddrSelector,
  makeSelectPrivKey,
  makeBlockySelector,
  makeNickNameSelector,
} from '../AccountProvider/selectors';
import {
  OVERVIEW,
  WALLET,
  EXCHANGE,
  INVEST,
  POWERUP,
  POWERDOWN,
  setActiveTab,
  setAmountUnit,
  setInvestType,
  toggleInvestTour,
} from './actions';
import messages from './messages';
import { txnsToList } from './txnsToList';
import {
  getActiveTab,
  getAmountUnit,
  getInvestType,
  getInvestTour,
  createDashboardTxsSelector,
} from './selectors';

import Container from '../../components/Container';
import H2 from '../../components/H2';
import Overview from '../../components/Dashboard/Overview';
import Wallet from '../../components/Dashboard/Wallet';
import Exchange from '../../components/Dashboard/Exchange';
import Invest from '../../components/Dashboard/Invest';
import SubmitButton from '../../components/SubmitButton';
import Balances from '../../components/Dashboard/Balances';

import PanesRoot from '../../components/Dashboard/PanesRoot';
import Tabs from '../../components/Dashboard/Tabs';

import {
  ABI_CONTROLLER_CONTRACT,
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  ABI_PROXY,
  ABI_TABLE_FACTORY,
  ABI_PULL_PAYMENT_CONTRACT,
  MAIN_NET_GENESIS_BLOCK,
  conf,
} from '../../app.config';

const confParams = conf();

const LOOK_BEHIND_PERIOD = 4 * 60 * 24;
const ETH_FISH_LIMIT = new BigNumber(0.1);

const PANES = {
  [OVERVIEW]: Overview,
  [WALLET]: Wallet,
  [EXCHANGE]: Exchange,
  [INVEST]: Invest,
};

const TABS = [
  {
    name: OVERVIEW,
    title: <FormattedMessage {...messages[OVERVIEW]} />,
    icon: 'fa-tachometer',
  },
  {
    name: WALLET,
    title: <FormattedMessage {...messages[WALLET]} />,
    icon: 'fa-money',
  },
  {
    name: EXCHANGE,
    title: <FormattedMessage {...messages[EXCHANGE]} />,
    icon: 'fa-exchange',
  },
  {
    name: INVEST,
    title: <FormattedMessage {...messages[INVEST]} />,
    icon: 'fa-line-chart',
  },
];

class DashboardRoot extends React.Component {
  constructor(props) {
    super(props);
    this.handleNTZTransfer = this.handleNTZTransfer.bind(this);
    this.handleNTZPurchase = this.handleNTZPurchase.bind(this);
    this.handleNTZSell = this.handleNTZSell.bind(this);
    this.handleETHTransfer = this.handleETHTransfer.bind(this);
    this.handleETHPayout = this.handleETHPayout.bind(this);
    this.handleABPPayout = this.handleABPPayout.bind(this);
    this.handlePowerUp = this.handlePowerUp.bind(this);
    this.handlePowerDown = this.handlePowerDown.bind(this);
    this.fishWarn = this.fishWarn.bind(this);
    this.web3 = props.web3Redux.web3;

    this.controller = this.web3.eth.contract(ABI_CONTROLLER_CONTRACT).at(confParams.contrAddr);
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.power = this.web3.eth.contract(ABI_POWER_CONTRACT).at(confParams.pwrAddr);
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);
    this.pullPayment = this.web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(confParams.pullAddr);

    this.tableFactory.getTables.call();
    if (this.props.account.proxy) {
      this.watchProxyEvents(this.props.account.proxy);
      this.watchTokenEvents(this.props.account.proxy);
      this.watchPowerEvents(this.props.account.proxy);
    }

    this.state = {
      isFishWarned: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { account } = this.props;
    const { account: nextAccount } = nextProps;

    if (account.proxy === undefined && nextAccount.proxy) {
      this.watchProxyEvents(nextAccount.proxy);
      this.watchTokenEvents(nextAccount.proxy);
      this.watchPowerEvents(nextAccount.proxy);
    }

    if (this.props.dashboardTxs.txError !== nextProps.dashboardTxs.txError && nextProps.dashboardTxs.txError) {
      this.props.modalAdd(
        <div>
          <H2>
            <FormattedMessage {...messages.transactionErrorTitle} />
          </H2>
          <p>{nextProps.dashboardTxs.txError}</p>
          <SubmitButton
            onClick={() => this.props.modalDismiss()}
          >
            <FormattedMessage {...messages.ok} />
          </SubmitButton>
        </div>
      );
    }
  }

  fishWarn() {
    this.setState({ isFishWarned: true });
  }

  watchProxyEvents(proxyAddr) {
    this.pullPayment.paymentOf.call(proxyAddr);
    this.power.downs.call(proxyAddr);

    this.proxy = this.web3.eth.contract(ABI_PROXY).at(proxyAddr);
    this.web3.eth.getBlockNumber((err, blockNumber) => {
      this.proxy.allEvents({
        fromBlock: blockNumber - LOOK_BEHIND_PERIOD,
        toBlock: 'latest',
      }).get((error, eventList) => {
        addEventsDate(eventList.filter(isUserEvent(proxyAddr)))
          .then((events) => this.props.proxyEvents(events, proxyAddr));
      });
    });
    this.proxy.allEvents({
      toBlock: 'latest',
    }).watch((error, event) => {
      if (!error && event) {
        if (event.event === 'Deposit') {
          this.pullPayment.paymentOf.call(proxyAddr);
        }

        addEventsDate([event])
          .then((events) => this.props.proxyEvents(events, proxyAddr));
        this.web3.eth.getBalance(proxyAddr);
      }
    });
  }

  watchPowerEvents(proxyAddr) {
    this.power.balanceOf.call(proxyAddr);
    this.web3.eth.getBlockNumber((err, blockNumber) => {
      this.power.allEvents({
        fromBlock: blockNumber - LOOK_BEHIND_PERIOD,
        toBlock: 'latest',
      }).get((error, eventList) => {
        addEventsDate(eventList.filter(isUserEvent(proxyAddr)))
          .then((events) => this.props.contractEvents(events, proxyAddr));
      });
    });

    this.power.downtime.call();
    this.power.totalSupply.call();
    this.power.activeSupply.call();
    this.controller.minimumPowerUpSizeBabz.call();
    this.power.allEvents({
      toBlock: 'latest',
    }).watch((error, event) => {
      if (!error && isUserEvent(proxyAddr)(event)) {
        addEventsDate([event])
          .then((events) => this.props.contractEvents(events, proxyAddr));
        this.power.balanceOf.call(proxyAddr);
        this.power.downs.call(proxyAddr);
        this.token.balanceOf.call(proxyAddr);
      }
    });
  }

  watchTokenEvents(proxyAddr) {
    this.token.floor.call();
    this.token.ceiling.call();
    this.controller.completeSupply.call();
    this.token.totalSupply.call();
    this.token.activeSupply.call();
    this.token.balanceOf.call(proxyAddr);
    this.web3.eth.getBalance(proxyAddr);

    this.web3.eth.getBlockNumber((err, blockNumber) => {
      this.token.allEvents({
        fromBlock: blockNumber - LOOK_BEHIND_PERIOD,
        toBlock: 'latest',
      }).get((error, eventList) => {
        addEventsDate(eventList.filter(isUserEvent(proxyAddr)))
          .then((events) => this.props.contractEvents(events, proxyAddr));
      });
    });

    this.token.allEvents({
      toBlock: 'latest',
    }).watch((error, event) => {
      if (!error && isUserEvent(proxyAddr)(event)) {
        if (event.event === 'Sell') {
          this.pullPayment.paymentOf.call(proxyAddr);
        }

        this.power.balanceOf.call(proxyAddr);
        this.token.balanceOf.call(proxyAddr);
        this.web3.eth.getBalance(proxyAddr);
      }
    });
  }

  async handleETHPayout(amount) {
    this.props.notifyCreate(ETH_PAYOUT, { amount });
    this.pullPayment.withdraw.sendTransaction({ from: this.proxy.address });
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

  handleETHTransfer(amount, dest) {
    this.props.notifyCreate(TRANSFER_ETH, { amount });
    return this.handleTxSubmit((callback) => {
      this.proxy.forward.sendTransaction(
        dest,
        new BigNumber(amount).mul(ETH_DECIMALS),
        '',
        callback
      );
    });
  }

  handlePowerUp(amount) {
    this.props.notifyCreate(POWERUP, { amount });
    return this.handleTxSubmit((callback) => {
      this.token.powerUp.sendTransaction(
        new BigNumber(amount).mul(NTZ_DECIMALS),
        callback
      );
    });
  }

  handlePowerDown(amount) {
    this.props.notifyCreate(POWERDOWN, { amount });
    return this.handleTxSubmit((callback) => {
      this.power.transfer.sendTransaction(
        0,
        new BigNumber(amount).mul(ABP_DECIMALS),
        callback
      );
    });
  }

  handleABPPayout() {
    const { account } = this.props;
    this.power.downTick.sendTransaction(account.proxy, (err, result) => {
      if (result) {
        waitForTx(getWeb3(), result).then(() => this.power.downs.call(account.proxy));
      }
    });
  }

  render() {
    const { account } = this.props;
    const { isFishWarned } = this.state;
    const qrUrl = `ether:${account.proxy}`;
    const downtime = this.power.downtime();
    const completeSupplyBabz = this.controller.completeSupply();
    const totalSupplyPwr = this.power.totalSupply();
    const activeSupplyPwr = this.power.activeSupply();
    const activeSupplyBabz = this.token.activeSupply();
    const minPowerUpBabz = this.controller.minimumPowerUpSizeBabz();
    const weiBalance = this.web3.eth.balance(account.proxy);
    const ethBalance = weiBalance && weiBalance.div(ETH_DECIMALS);
    const babzBalance = this.token.balanceOf(account.proxy);
    const nutzBalance = babzBalance && babzBalance.div(NTZ_DECIMALS);
    const pwrBalance = this.power.balanceOf(account.proxy);
    const downs = this.power.downs(account.proxy);
    const [ethAllowance, ethPayoutDate] = this.pullPayment.paymentOf(account.proxy) || [];
    const floor = this.token.floor();
    const ceiling = this.token.ceiling();
    const tables = this.tableFactory.getTables();
    const listTxns = txnsToList(
      this.props.dashboardTxs.dashboardEvents,
      tables,
      account.proxy
    );
    // before crowdsale end, disable INVEST tab on production
    const disabledTabs = conf().firstBlockHash === MAIN_NET_GENESIS_BLOCK ? [INVEST] : [];
    return (
      <Container>
        <Tabs
          tabs={TABS}
          disabledTabs={disabledTabs}
          {...this.props}
        />
        <Balances
          babzBalance={babzBalance}
          pwrBalance={pwrBalance}
          weiBalance={weiBalance}
        />
        <PanesRoot
          panes={PANES}
          paneType={this.props.activeTab}
          paneProps={{
            ETH_FISH_LIMIT,
            minPowerUpBabz,
            weiBalance,
            floor,
            ceiling,
            babzBalance,
            ethBalance,
            ethAllowance,
            ethPayoutDate,
            ethPayoutPending: this.props.dashboardTxs.pendingETHPayout,
            abpPayoutPending: this.props.dashboardTxs.pendingABPPayout,
            pwrBalance,
            nutzBalance,
            totalSupplyPwr,
            completeSupplyBabz,
            activeSupplyPwr,
            activeSupplyBabz,
            listTxns,
            qrUrl,
            messages,
            isFishWarned,
            downtime,
            downs: downs && [...downs],
            handleNTZSell: this.handleNTZSell,
            handleNTZPurchase: this.handleNTZPurchase,
            handleNTZTransfer: this.handleNTZTransfer,
            handleETHTransfer: this.handleETHTransfer,
            handleETHPayout: this.handleETHPayout,
            handleABPPayout: this.handleABPPayout,
            handlePowerDown: this.handlePowerDown,
            handlePowerUp: this.handlePowerUp,
            fishWarn: this.fishWarn,
            ...this.props,
          }}
        />
        <InvestTour {...this.props} />
      </Container>
    );
  }
}
DashboardRoot.propTypes = {
  activeTab: PropTypes.string,
  account: PropTypes.object,
  contractEvents: PropTypes.func,
  dashboardTxs: PropTypes.object,
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
  proxyEvents: PropTypes.func,
  web3Redux: PropTypes.any,
  notifyCreate: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  setInvestType,
  setActiveTab,
  setAmountUnit,
  toggleInvestTour,
  notifyCreate: (type, props) => dispatch(notifyCreate(type, props)),
  modalAdd,
  modalDismiss,
  proxyEvents,
  contractEvents,
  accountLoaded,
});

const mapStateToProps = createStructuredSelector({
  activeTab: getActiveTab(),
  account: makeSelectAccountData(),
  blocky: makeBlockySelector(),
  dashboardTxs: createDashboardTxsSelector(),
  nickName: makeNickNameSelector(),
  signerAddr: makeSignerAddrSelector(),
  privKey: makeSelectPrivKey(),
  amountUnit: getAmountUnit(),
  investType: getInvestType(),
  investTour: getInvestTour(),
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardRoot);
