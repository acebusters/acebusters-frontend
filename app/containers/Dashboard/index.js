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
    const qrUrl = `ether:${this.props.address}`;
    let balance = this.token.balanceOf(this.proxyAddress);
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
          ProxyAddress: { this.proxyAddress }
        </div>
        <div>
          address: {this.props.address}
          <QRCode value={qrUrl} />
        </div>
        <div>
          balance: {balance}
          <button onClick={this.handleGetBalance}>getBalance</button>
          <button onClick={this.handleTransfer}>Transfer</button>
        </div>
        <button onClick={this.props.transferToggle}>Transfer</button>

        <h2><FormattedMessage {...messages.pending} /></h2>
        <List items={this.props.account[tokenContractAddress]} />

        <h2><FormattedMessage {...messages.included} /></h2>
        <List items={this.props.account[tokenContractAddress]} />
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
