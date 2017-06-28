import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import ethUtil from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

import { getWeb3 } from '../AccountProvider/sagas';
import makeSelectAccountData, { makeSignerAddrSelector, makeSelectPrivKey } from '../AccountProvider/selectors';
import messages from './messages';
import { modalAdd, modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { contractEvents, accountLoaded, transferETH, proxyEvents } from '../AccountProvider/actions';
import { addEventsDate, isUserEvent } from '../AccountProvider/utils';
import { createBlocky } from '../../services/blockies';
import { ABI_TOKEN_CONTRACT, ABI_ACCOUNT_FACTORY, ABI_PROXY, ABI_TABLE_FACTORY, conf } from '../../app.config';
import { ETH_DECIMALS, NTZ_DECIMALS, formatEth, formatNtz } from '../../utils/amountFormater';

import List from '../../components/List';
import H2 from '../../components/H2';
import Alert from '../../components/Alert';
import TransferDialog from '../TransferDialog';
import ExchangeDialog from '../ExchangeDialog';
import Container from '../../components/Container';
import Button from '../../components/Button';
import SubmitButton from '../../components/SubmitButton';
import Blocky from '../../components/Blocky';
import WithLoading from '../../components/WithLoading';

import { Section } from './styles';
import { createDashboardTxsSelector } from './selectors';
import { txnsToList } from './txnsToList';

const confParams = conf();

const LOOK_BEHIND_PERIOD = 4 * 60 * 24;

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleNTZTransfer = this.handleNTZTransfer.bind(this);
    this.handleNTZPurchase = this.handleNTZPurchase.bind(this);
    this.handleNTZSell = this.handleNTZSell.bind(this);
    this.handleETHTransfer = this.handleETHTransfer.bind(this);
    this.web3 = props.web3Redux.web3;

    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);

    this.tableFactory.getTables.call();

    if (this.props.account.proxy) {
      this.token.floor.call();
      this.token.ceiling.call();
      this.token.balanceOf.call(this.props.account.proxy);
      this.web3.eth.getBalance(this.props.account.proxy);
      this.watchProxyEvents(this.props.account.proxy);
      this.watchTokenEvents(this.props.account.proxy);
    }
  }

  componentDidMount() {
    if (this.props.account && this.props.account.proxy === '0x') {
      this.watchAccountCreated();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account.proxy === undefined && nextProps.account.proxy) {
      this.token.floor.call();
      this.token.ceiling.call();
      this.watchProxyEvents(nextProps.account.proxy);
      this.watchTokenEvents(nextProps.account.proxy);
      this.token.balanceOf.call(nextProps.account.proxy);
      this.web3.eth.getBalance(nextProps.account.proxy);
    }

    if (this.props.dashboardTxs.txError !== nextProps.dashboardTxs.txError && nextProps.dashboardTxs.txError) {
      this.props.modalAdd(
        <div>
          <H2>
            <FormattedMessage {...messages.transactionErrorTitle} />
          </H2>
          <p>{nextProps.dashboardTxs.txError}</p>
          <SubmitButton
            onClick={() => {
              this.props.dispatch(nextProps.dashboardTxs.failedTxAction);
              this.props.modalDismiss();
            }}
          >
            <FormattedMessage {...messages.retryTransaction} />
          </SubmitButton>
        </div>
      );
    }

    // Note: listen to AccountFactory's AccountCreated Event if proxy address is not ready
    if (nextProps.account && this.props
        && nextProps.account.proxy !== this.props.account.proxy
        && nextProps.account.proxy === '0x') {
      this.watchAccountCreated();
    }
  }

  watchProxyEvents(proxyAddr) {
    const web3 = getWeb3();
    this.proxy = web3.eth.contract(ABI_PROXY).at(proxyAddr);

    this.web3.eth.getBlockNumber((err, blockNumber) => {
      this.proxy.allEvents({
        fromBlock: blockNumber - LOOK_BEHIND_PERIOD,
        toBlock: 'latest',
      }).get((error, eventList) => {
        addEventsDate(eventList.filter(isUserEvent(proxyAddr)))
          .then(this.props.proxyEvents);
      });
    });

    this.proxy.Received({
      toBlock: 'latest',
    }).watch((error, event) => {
      if (!error && event) {
        addEventsDate([event]).then(this.props.proxyEvents);
        this.web3.eth.getBalance(proxyAddr);
      }
    });
  }

  watchTokenEvents(proxyAddr) {
    this.web3.eth.getBlockNumber((err, blockNumber) => {
      this.token.allEvents({
        fromBlock: blockNumber - LOOK_BEHIND_PERIOD,
        toBlock: 'latest',
      }).get((error, eventList) => {
        addEventsDate(eventList.filter(isUserEvent(proxyAddr)))
          .then(this.props.contractEvents);
      });
    });

    this.token.allEvents({
      toBlock: 'latest',
    }).watch((watchError, event) => {
      if (!watchError && isUserEvent(proxyAddr)(event)) {
        this.token.balanceOf.call(this.props.account.proxy);
        this.web3.eth.getBalance(this.props.account.proxy);
        const { pendingSell = [] } = this.props.dashboardTxs;

        if (pendingSell.indexOf(event.transactionHash) > -1) {
          this.token.transferFrom.sendTransaction(
            confParams.ntzAddr,
            this.props.account.proxy,
            0,
            { from: this.props.account.proxy }
          );
        }
      }
    });

    // Check if we have unfinished sell
    this.token.allowance.callPromise(
      confParams.ntzAddr,
      proxyAddr,
    ).then((value) => {
      if (!value.eq(0)) {
        this.token.transferFrom.sendTransaction(
          confParams.ntzAddr,
          this.props.account.proxy,
          0,
          { from: this.props.account.proxy }
        );
      }
    });
  }

  watchAccountCreated() {
    const web3 = getWeb3();
    const privKey = this.props.privKey;
    const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
    const signer = `0x${ethUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
    const accountFactory = web3.eth.contract(ABI_ACCOUNT_FACTORY).at(confParams.accountFactory);
    const events = accountFactory.AccountCreated({ signer }, { fromBlock: 'latest' });

    events.watch((err, ev) => {  // eslint-disable-line no-unused-vars
      accountFactory.getAccount.call(signer, (e, res) => {
        const proxy = res[0];
        const controller = res[1];
        const lastNonce = res[2].toNumber();

        this.props.accountLoaded({ proxy, controller, lastNonce });
      });

      events.stopWatching();
    });
  }

  handleNTZTransfer(to, amount) {
    this.token.transfer.sendTransaction(
      to,
      new BigNumber(amount).mul(NTZ_DECIMALS)
    );
    this.props.modalDismiss();
  }

  handleNTZPurchase(amount) {
    this.props.transferETH({
      dest: confParams.ntzAddr,
      amount: new BigNumber(amount).mul(ETH_DECIMALS),
    });
    this.props.modalDismiss();
  }

  handleNTZSell(amount) {
    this.token.transfer.sendTransaction(
      confParams.ntzAddr,
      new BigNumber(amount).mul(NTZ_DECIMALS),
      { from: this.props.account.proxy }
    );
    this.props.modalDismiss();
  }

  handleETHTransfer(dest, amount) {
    this.props.transferETH({
      dest,
      amount: new BigNumber(amount).mul(ETH_DECIMALS),
    });
    this.props.modalDismiss();
  }

  render() {
    const qrUrl = `ether:${this.props.account.proxy}`;
    const weiBalance = this.web3.eth.balance(this.props.account.proxy);
    const floor = this.token.floor();
    const ceiling = this.token.ceiling();
    const babzBalance = this.token.balanceOf(this.props.account.proxy);
    const tables = this.tableFactory.getTables();

    const listTxns = txnsToList(
      this.props.dashboardTxs.dashboardEvents,
      tables,
      this.props.account.proxy
    );

    return (
      <Container>
        <h1><FormattedMessage {...messages.header} /></h1>

        <Section>
          <Blocky blocky={createBlocky(this.props.signerAddr)} />
          <h3>Your address:</h3>

          <WithLoading
            isLoading={!this.props.account.proxy || this.props.account.proxy === '0x'}
            loadingSize="40px"
            styles={{ layout: { transform: 'translateY(-50%)', left: 0 } }}
          >
            <p> { this.props.account.proxy } </p>
            <QRCode value={qrUrl} size={120} />

            <Alert theme="danger">
              <FormattedMessage {...messages.ethAlert} />
            </Alert>
          </WithLoading>

        </Section>

        <Section>
          <h2>Nutz</h2>
          <p>
            <span>Balance: </span>
            <WithLoading
              isLoading={!babzBalance}
              loadingSize="14px"
              type="inline"
              styles={{ layout: { marginLeft: '15px' } }}
            >
              <span>{babzBalance && formatNtz(babzBalance)} NTZ</span>
            </WithLoading>
          </p>
          {babzBalance &&
            <Button
              align="left"
              onClick={() => {
                this.props.modalAdd(
                  <TransferDialog
                    handleTransfer={this.handleNTZTransfer}
                    maxAmount={babzBalance.div(NTZ_DECIMALS)}
                    amountUnit="NTZ"
                  />
                );
              }}
              size="medium"
              icon="fa fa-money"
            >
              TRANSFER
            </Button>
          }
          {babzBalance && floor &&
            <Button
              align="left"
              onClick={() => {
                this.props.modalAdd(
                  <ExchangeDialog
                    title={<FormattedMessage {...messages.sellTitle} />}
                    amountUnit="ntz"
                    calcExpectedAmount={(amount) => new BigNumber(amount).div(floor)}
                    handleExchange={this.handleNTZSell}
                    maxAmount={babzBalance.div(NTZ_DECIMALS)}
                  />
                );
              }}
              size="medium"
              icon="fa fa-money"
            >
              SELL
            </Button>
          }
          {weiBalance && ceiling &&
            <Button
              align="left"
              onClick={() => {
                this.props.modalAdd(
                  <ExchangeDialog
                    title={<FormattedMessage {...messages.purchaseTitle} />}
                    amountUnit="eth"
                    calcExpectedAmount={(amount) => ceiling.mul(amount)}
                    handleExchange={this.handleNTZPurchase}
                    maxAmount={weiBalance.div(ETH_DECIMALS)}
                  />
                );
              }}
              size="medium"
              icon="fa fa-money"
            >
              PURCHASE
            </Button>
          }
        </Section>

        <Section>
          <h2>Ether</h2>
          <p>
            <span>Balance: </span>
            <WithLoading
              isLoading={!weiBalance}
              loadingSize="14px"
              type="inline"
              styles={{ layout: { marginLeft: '15px' } }}
            >
              <span>{weiBalance && formatEth(weiBalance)} ETH</span>
            </WithLoading>
          </p>
          {weiBalance &&
            <Button
              align="left"
              onClick={() => {
                this.props.modalAdd(
                  <TransferDialog
                    handleTransfer={this.handleETHTransfer}
                    maxAmount={weiBalance.div(ETH_DECIMALS)}
                    amountUnit="ETH"
                  />
                );
              }}
              size="medium"
              icon="fa fa-money"
            >
              TRANSFER
            </Button>
          }
        </Section>

        <Section>
          <h2><FormattedMessage {...messages.included} /></h2>
          <List
            items={listTxns}
            headers={[
              '',
              'Address',
              'Date',
              '',
              'Amount',
              '',
            ]}
            columnsStyle={{
              0: { width: 20 },
              1: { textAlign: 'left', width: 10, whiteSpace: 'nowrap' },
              2: { width: 20 },
              3: { textAlign: 'left', whiteSpace: 'nowrap' },
              4: { textAlign: 'right', whiteSpace: 'nowrap' },
              5: { width: '100%', textAlign: 'left' },
            }}
            noDataMsg="No Transactions Yet"
          />
        </Section>
      </Container>
    );
  }
}

Dashboard.propTypes = {
  modalAdd: PropTypes.func,
  transferETH: PropTypes.func,
  proxyEvents: PropTypes.func,
  modalDismiss: PropTypes.func,
  contractEvents: PropTypes.func,
  accountLoaded: PropTypes.func,
  web3Redux: PropTypes.any,
  signerAddr: PropTypes.string,
  account: PropTypes.object,
  dashboardTxs: PropTypes.object,
  privKey: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  dashboardTxs: createDashboardTxsSelector(),
  signerAddr: makeSignerAddrSelector(),
  privKey: makeSelectPrivKey(),
});

function mapDispatchToProps() {
  return {
    modalAdd,
    modalDismiss,
    transferETH,
    proxyEvents,
    contractEvents,
    accountLoaded,
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
