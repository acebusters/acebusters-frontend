import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import makeSelectAccountData, { makeSignerAddrSelector } from '../AccountProvider/selectors';
import messages from './messages';
import { modalAdd, modalDismiss } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { contractEvent } from '../AccountProvider/actions';
import { ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';
import { createBlocky } from '../../services/blockies';

import List from '../../components/List';
import TransferDialog from '../TransferDialog';
import Container from '../../components/Container';
import Button from '../../components/Button';
import Blocky from '../../components/Blocky';
import FormGroup from '../../components/Form/FormGroup';

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

  componentWillReceiveProps(nextProps) {
    const balance = this.token.balanceOf(this.props.account.proxy);
    if (!balance && nextProps.account.proxy) {
      this.token.balanceOf.call(nextProps.account.proxy);
    }
  }

  handleTransfer(to, amount) {
    this.token.transfer.sendTransaction(to, amount);
    this.props.modalDismiss();
  }

  render() {
    const qrUrl = `ether:${this.props.account.proxy}`;
    let balance = this.token.balanceOf(this.props.account.proxy);
    if (balance) {
      balance = balance.toString();
    }
    let listPending = [];
    let listTxns = [];
    if (this.props.account[tokenContractAddress]) {
      listPending = pendingToList(this.props.account[tokenContractAddress].pending);
      listTxns = txnsToList(this.props.account[tokenContractAddress].transactions, this.props.account.proxy);
    }
    return (
      <Container>
        <h1><FormattedMessage {...messages.header} /></h1>
        <Blocky blocky={createBlocky(this.props.signerAddr)} />
        <h3> Your address:</h3>
        <p> { this.props.account.proxy } </p>
        <QRCode value={qrUrl} size={120} />
        <p>Balance: {balance}</p>
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
        <List items={listPending} headers={['#', 'data', 'txHash']} />
        <h2><FormattedMessage {...messages.included} /></h2>
        <List items={listTxns} headers={['txHash', 'from', 'to', 'amount']} />

      </Container>
    );
  }
}

const pendingToList = (pending) => {
  let list = [];
  if (pending) {
    list = Object.keys(pending).map((key) => [key, pending[key].call, pending[key].txHash]);
  }
  return list;
};

const txnsToList = (txns, proxyAddr) => {
  let list = [];
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
  web3Redux: PropTypes.any,
  signerAddr: PropTypes.string,
  account: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  signerAddr: makeSignerAddrSelector(),
});


function mapDispatchToProps() {
  return {
    modalAdd: (node) => (modalAdd(node)),
    modalDismiss: () => (modalDismiss()),
    contractEvent: (event) => (contractEvent({ event })),
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
