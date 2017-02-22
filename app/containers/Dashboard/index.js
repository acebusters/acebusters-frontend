import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { makeAddressSelector, makeSelectAccountData } from '../AccountProvider/selectors';
import messages from './messages';
import { transferToggle } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';

import List from '../../components/List';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleGetBlockNumber = this.handleGetBlockNumber.bind(this);
    this.handleGetBalance = this.handleGetBalance.bind(this);
    this.handleIssue = this.handleIssue.bind(this);
    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
    this.test = this.web3.eth.contract([{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Issuance","type":"event"}]).at("0x2be115cf6a5f853358052fd4c6563993086d2e8d");
  }

  handleGetBlockNumber() {
    this.props.web3Redux.web3.eth.getBlockNumber();
  }

  handleGetBalance() {
    this.token.balanceOf.call('0x6b569b17c684db05cdef8ab738b4be700138f70a');
  }

  handleIssue() {
    this.test.issue.sendTransaction(2000);
  }

  render() {
    const qrUrl = `ether:${this.props.address}`;
    let balance = this.token.balanceOf('0x6b569b17c684db05cdef8ab738b4be700138f70a');
    if (balance) {
      balance = balance.toString();
    }
    return (
      <div>
        <h1><FormattedMessage {...messages.header} /></h1>
        <div>
          last block: {this.web3.eth.blockNumber()}
          <br />
          <button onClick={this.handleGetBlockNumber}>getBlockNumber</button>
        </div>
        <div>
          address: {this.props.address}
          <QRCode value={qrUrl} />
        </div>
        <div>
          balance: {balance}
          <button onClick={this.handleGetBalance}>getBalance</button>
          <button onClick={this.handleIssue}>issue</button>
        </div>
        <button onClick={this.props.transferToggle}>Transfer</button>

        <h2><FormattedMessage {...messages.pending} /></h2>
        <List items={this.props.account['0xc5fe8ed3c565fdcad79c7b85d68378aa4b68699e']} />

        <h2><FormattedMessage {...messages.included} /></h2>
        <List items={this.props.account['0xc5fe8ed3c565fdcad79c7b85d68378aa4b68699e']} />
      </div>
    );
  }
}

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
