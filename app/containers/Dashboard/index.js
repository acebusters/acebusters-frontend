import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { makeAddressSelector, makeSelectAccountData } from '../AccountProvider/selectors';
import messages from './messages';
import { transferToggle } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { ABI_TOKEN_CONTRACT, ABI_ACCOUNT_FACTORY, tokenContractAddress, accountFactoryAddress } from '../../app.config';

import List from '../../components/List';
import Label from '../../components/Label';
import Container from '../../components/Container';
import Button from '../../components/Button';
import Form from '../../components/Form';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleGetBlockNumber = this.handleGetBlockNumber.bind(this);
    this.handleGetBalance = this.handleGetBalance.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    this.accountFactory = this.web3.eth.contract(ABI_ACCOUNT_FACTORY).at(accountFactoryAddress);
  }

  handleGetBlockNumber() {
    this.props.web3Redux.web3.eth.getBlockNumber();
  }

  handleGetBalance() {
    this.accountFactory.signerToProxy.callPromise(this.props.address).then((res) => {
      this.proxyAddress = res;
      this.token.balanceOf.call(res);
    }, (err) => {
      // error case;
      console.log(err);
    });
  }

  handleTransfer() {
    this.token.transfer.sendTransaction('0x297d02da6733fc66d260dd6956cff04d2d030855', 2000);
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
      listTxns = txnsToList(this.props.account[tokenContractAddress].transactions);
    }
    return (
      <Container>
        <h1><FormattedMessage {...messages.header} /></h1>
        <Form>
          <Label>Last Block {this.web3.eth.blockNumber()}</Label>
          <Form>
            <Button size="small" onClick={this.handleGetBlockNumber}>Get Block #</Button>
          </Form>
        </Form>
        <Form>
          <Label>ProxyAddress: { this.proxyAddress }</Label>
        </Form>

        <Form>
          <h3> Your private key</h3>
          <QRCode value={qrUrl} size={120} />
        </Form>
        <Form>
          <Label>Balance: {balance}</Label>
          <Form>
            <Button onClick={this.handleGetBalance} size="small">Refresh Balance</Button>
            <Button onClick={this.handleTransfer} size="small">Transfer</Button>
            <Button onClick={this.props.transferToggle} size="small">Transfer</Button>
          </Form>
        </Form>
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

const txnsToList = (txns) => {
  let list = [];
  if (txns) {
    list = Object.keys(txns).map((key) => [key, txns[key].from, txns[key].to, txns[key].value]);
  }
  return list;
};

Dashboard.propTypes = {
  transferToggle: PropTypes.func,
  web3Redux: PropTypes.any,
  address: PropTypes.string,
  account: PropTypes.any,
};

const mapStateToProps = createSelector(
  makeAddressSelector(), makeSelectAccountData(),
  (address, account) => ({
    address,
    account,
  })
);


function mapDispatchToProps(dispatch) {
  return {
    transferToggle: () => dispatch(transferToggle()),
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
