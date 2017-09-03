import React from 'react';
import { SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import BigNumber from 'bignumber.js';

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
} from './actions';
import messages from './messages';
import { txnsToList } from './txnsToList';
import {
  getActiveTab,
  getAmountUnit,
  getInvestType,
  createDashboardTxsSelector,
} from './selectors';
import { downRequestsToList } from './downRequestsToList';

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
  ABI_TOKEN_CONTRACT,
  ABI_POWER_CONTRACT,
  ABI_PROXY,
  ABI_TABLE_FACTORY,
  ABI_PULL_PAYMENT_CONTRACT,
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
    this.handlePowerUp = this.handlePowerUp.bind(this);
    this.handlePowerDown = this.handlePowerDown.bind(this);
    this.web3 = props.web3Redux.web3;

    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.power = this.web3.eth.contract(ABI_POWER_CONTRACT).at(confParams.pwrAddr);
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);
    this.pullPayment = this.web3.eth.contract(ABI_PULL_PAYMENT_CONTRACT).at(confParams.pullAddr);

    this.tableFactory.getTables.call();
    if (this.props.account.proxy) {
      this.watchProxyEvents(this.props.account.proxy);
      this.watchTokenEvents(this.props.account.proxy);
      this.watchPowerEvents(this.props.account.proxy);
      this.power.balanceOf.call(this.props.account.proxy);
      this.pullPayment.paymentOf.call(this.props.account.proxy);
    }

    this.state = {
      downRequests: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { account } = this.props;
    const { account: nextAccount } = nextProps;

    if (account.proxy === undefined && nextAccount.proxy) {
      this.watchProxyEvents(nextAccount.proxy);
      this.watchTokenEvents(nextAccount.proxy);
      this.watchPowerEvents(nextAccount.proxy);
      this.power.balanceOf.call(nextAccount.proxy);

      this.pullPayment.paymentOf.call(nextAccount.proxy);
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

  watchProxyEvents(proxyAddr) {
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

    this.loadDownRequests();
  }

  watchPowerEvents(proxyAddr) {
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
    this.power.allEvents({
      toBlock: 'latest',
    }).watch((error, event) => {
      addEventsDate([event])
        .then((events) => this.props.contractEvents(events, proxyAddr));
    });
  }

  watchTokenEvents(proxyAddr) {
    this.token.floor.call();
    this.token.ceiling.call();
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
    }).watch((watchError, event) => {
      if (!watchError && isUserEvent(proxyAddr)(event)) {
        if (event.event === 'Sell') {
          this.pullPayment.paymentOf.call(proxyAddr);
        }

        this.power.balanceOf.call(proxyAddr);
        this.token.balanceOf.call(proxyAddr);
        this.web3.eth.getBalance(proxyAddr);
      }
    });
  }

  loadDownRequests() {
    const power = getWeb3().eth.contract(ABI_POWER_CONTRACT).at(confParams.pwrAddr);
    const result = [];
    const batchSize = 20;
    let stop = false;
    const promise = new Promise((resolve, reject) => {
      const runBatch = (base) => {
        // ToDo: find a bug with batch and use it
        // const batch = getWeb3().createBatch();
        for (let i = 0; i < batchSize; i += 1) {
          // batch.add(
          power.downs.call(base + i, (err, request) => { // eslint-disable-line
            if (err) {
              reject(err);
              return;
            }
            if (request[0] !== '0x') {
              result[base + i] = [base + i, ...request];
            } else {
              stop = true;
            }

            if (i + 1 === batchSize) {
              if (stop) {
                resolve(result);
              } else {
                runBatch(base + batchSize);
              }
            }
          });
        }
        // batch.execute();
      };

      runBatch(0);
    });

    promise
      .then((requests) => requests.filter((r) => r[1] === this.props.account.proxy))
      .then((requests) => this.setState({ downRequests: requests }));
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

  handleTickClick(pos) {
    this.power.downTick.sendTransaction(pos, (err, result) => {
      if (result) {
        waitForTx(getWeb3(), result).then(() => this.loadDownRequests());
      }
    });
  }

  render() {
    const { account } = this.props;
    const { downRequests } = this.state;
    const qrUrl = `ether:${account.proxy}`;
    const downtime = this.power.downtime();
    const totalSupply = this.power.totalSupply();
    const weiBalance = this.web3.eth.balance(account.proxy);
    const ethBalance = weiBalance && weiBalance.div(ETH_DECIMALS);
    const babzBalance = this.token.balanceOf(account.proxy);
    const nutzBalance = babzBalance && babzBalance.div(NTZ_DECIMALS);
    const pwrBalance = this.power.balanceOf(account.proxy);
    const [ethAllowance, ethPayoutDate] = this.pullPayment.paymentOf(account.proxy) || [];
    const floor = this.token.floor();
    const ceiling = this.token.ceiling();
    const tables = this.tableFactory.getTables();
    const calcETHAmount = (ntz) => new BigNumber(ntz.toString()).div(floor);
    const calcNTZAmount = (eth) => ceiling.mul(eth.toString());
    const listTxns = txnsToList(
      this.props.dashboardTxs.dashboardEvents,
      tables,
      account.proxy
    );
    return (
      <Container>
        <Tabs tabs={TABS} {...this.props} />
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
            calcETHAmount,
            calcNTZAmount,
            weiBalance,
            floor,
            ceiling,
            babzBalance,
            ethBalance,
            ethAllowance,
            ethPayoutDate,
            ethPayoutPending: this.props.dashboardTxs.pendingETHPayout,
            pwrBalance,
            nutzBalance,
            totalSupply,
            listTxns,
            qrUrl,
            messages,
            downRequests: downRequestsToList(
              downRequests,
              downtime,
              (pos) => this.handleTickClick(pos),
            ),
            handleNTZSell: this.handleNTZSell,
            handleNTZPurchase: this.handleNTZPurchase,
            handleNTZTransfer: this.handleNTZTransfer,
            handleETHTransfer: this.handleETHTransfer,
            handleETHPayout: this.handleETHPayout,
            handlePowerDown: this.handlePowerDown,
            handlePowerUp: this.handlePowerUp,
            ...this.props,
          }}
        />
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
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardRoot);
