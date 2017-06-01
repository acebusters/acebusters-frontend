import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import ethUtil from 'ethereumjs-util';

import { getWeb3 } from '../AccountProvider/sagas';
import makeSelectAccountData, { makeSignerAddrSelector, makeSelectPrivKey } from '../AccountProvider/selectors';
import messages from './messages';
import { modalAdd, modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { contractEvent, accountLoaded } from '../AccountProvider/actions';
import { createBlocky } from '../../services/blockies';
import {
  ABI_TOKEN_CONTRACT,
  ABI_ACCOUNT_FACTORY,
  tokenContractAddress,
  accountFactoryAddress,
} from '../../app.config';

import List from '../../components/List';
import TransferDialog from '../TransferDialog';
import Container from '../../components/Container';
import Button from '../../components/Button';
import Blocky from '../../components/Blocky';
import FormGroup from '../../components/Form/FormGroup';
import WithLoading from '../../components/WithLoading';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    this.web3.eth.getBlockNumber((err, blockNumber) => {
      const events = this.token.allEvents({ fromBlock: blockNumber - (4 * 60 * 24), toBlock: 'latest' });
      events.get((error, eventList) => {
        eventList.forEach((event) => {
          props.contractEvent(event);
        });
      });
    });
  }

  componentDidMount() {
    if (this.props.account && this.props.account.proxy === '0x') {
      this.watchAccountCreated();
    }
  }

  componentWillReceiveProps(nextProps) {
    const balance = this.token.balanceOf(this.props.account.proxy);
    if (!balance && nextProps.account.proxy) {
      this.token.balanceOf.call(nextProps.account.proxy);
    }

    // Note: listen to AccountFactory's AccountCreated Event if proxy address is not ready
    if (nextProps.account && this.props
        && nextProps.account.proxy !== this.props.account.proxy
        && nextProps.account.proxy === '0x') {
      this.watchAccountCreated();
    }
  }

  handleTransfer(to, amount) {
    this.token.transfer.sendTransaction(to, amount);
    this.props.modalDismiss();
  }

  watchAccountCreated() {
    const web3 = getWeb3();
    const privKey = this.props.privKey;
    const privKeyBuffer = new Buffer(privKey.replace('0x', ''), 'hex');
    const signer = `0x${ethUtil.privateToAddress(privKeyBuffer).toString('hex')}`;
    const accountFactory = web3.eth.contract(ABI_ACCOUNT_FACTORY)
                                    .at(accountFactoryAddress);
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

  render() {
    const qrUrl = `ether:${this.props.account.proxy}`;
    let balance = this.token.balanceOf(this.props.account.proxy);
    if (balance) {
      balance = balance.toString();
    }
    let listPending = null;
    let listTxns = null;
    if (this.props.account[tokenContractAddress]) {
      listPending = pendingToList(this.props.account[tokenContractAddress].pending);
      listTxns = txnsToList(this.props.account[tokenContractAddress].transactions, this.props.account.proxy);
    }

    return (
      <Container>
        <h1><FormattedMessage {...messages.header} /></h1>
        <Blocky blocky={createBlocky(this.props.signerAddr)} />
        <h3> Your address:</h3>

        <WithLoading
          isLoading={!this.props.account.proxy || this.props.account.proxy === '0x'}
          loadingSize="40px"
          styles={{ layout: { transform: 'translateY(-50%)', left: 0 } }}
        >
          <p> { this.props.account.proxy } </p>
          <QRCode value={qrUrl} size={120} />
        </WithLoading>

        <p>
          <span>Balance: </span>
          <WithLoading
            isLoading={balance === undefined || balance === null}
            loadingSize="14px"
            type="inline"
            styles={{ layout: { marginLeft: '15px' } }}
          >
            <span>{balance}</span>
          </WithLoading>

        </p>

        <FormGroup>
          <Button
            onClick={() => {
              this.props.modalAdd((
                <TransferDialog handleTransfer={this.handleTransfer} />
              ));
            }}
            size="medium"
            icon="fa fa-money"
          >TRANSFER</Button>
        </FormGroup>
        <hr />
        <h2><FormattedMessage {...messages.pending} /></h2>
        <List items={listPending} headers={['#', 'txHash']} noDataMsg="No Pending Transactions" />
        <h2><FormattedMessage {...messages.included} /></h2>
        <List items={listTxns} headers={['txHash', 'from', 'to', 'amount']} noDataMsg="No Transactions Yet" />

      </Container>
    );
  }
}

const pendingToList = (pending) => {
  let list = [];
  if (pending) {
    list = Object.keys(pending).map((key) => [key, pending[key].txHash]);
  }
  return list;
};

const txnsToList = (txns, proxyAddr) => {
  let list = null;

  if (txns) {
    const onlyMine = [];

    Object.keys(txns).forEach((key) => {
      if (key && txns[key] && txns[key].from && txns[key].to) {
        if (txns[key].from === proxyAddr || txns[key].to === proxyAddr) {
          onlyMine.push({
            txHash: key,
            blockNumber: txns[key].blockNumber,
            from: txns[key].from,
            to: txns[key].to,
            value: (txns[key].to === proxyAddr) ? txns[key].value : txns[key].value * -1,
          });
        }
      }
    });
    list = onlyMine.map((entry) => [entry.txHash.substring(2, 8), entry.from.substring(2, 8), entry.to.substring(2, 8), entry.value]);
  }
  return list;
};

Dashboard.propTypes = {
  modalAdd: PropTypes.func,
  modalDismiss: PropTypes.func,
  contractEvent: PropTypes.func,
  accountLoaded: PropTypes.func,
  web3Redux: PropTypes.any,
  signerAddr: PropTypes.string,
  account: PropTypes.any,
  privKey: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  signerAddr: makeSignerAddrSelector(),
  privKey: makeSelectPrivKey(),
});


function mapDispatchToProps() {
  return {
    modalAdd: (node) => (modalAdd(node)),
    modalDismiss: () => (modalDismiss()),
    contractEvent: (event) => (contractEvent({ event })),
    accountLoaded: (data) => accountLoaded(data),
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
