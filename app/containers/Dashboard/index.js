import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import { makeAddressSelector } from '../AccountProvider/selectors';
import messages from './messages';
import { transferToggle } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';
import { ABI_TOKEN_CONTRACT, tokenContractAddress } from '../../app.config';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleGetBlockNumber = this.handleGetBlockNumber.bind(this);
    this.handleGetBalance = this.handleGetBalance.bind(this);
    this.handleIssue = this.handleIssue.bind(this);
    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(tokenContractAddress);
  }

  handleGetBlockNumber() {
    this.props.web3Redux.web3.eth.getBlockNumber();
  }

  handleGetBalance() {
    this.token.balanceOf.call('0x6b569b17c684db05cdef8ab738b4be700138f70a');
  }

  handleIssue() {
    this.token.issue.sendTransaction(2000);
  }

  render() {
    const qrUrl = `ether:${this.props.address}`;
    let balance = this.token.balanceOf('0x6b569b17c684db05cdef8ab738b4be700138f70a');
    if (balance) {
      balance = balance.toString();
    }
    return (
      <div>
        <FormattedMessage {...messages.header} />
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
      </div>
    );
  }
}

Dashboard.propTypes = {
  transferToggle: PropTypes.func,
  web3Redux: PropTypes.any,
  address: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeAddressSelector(),
  (address) => ({
    address,
  })
);


function mapDispatchToProps(dispatch) {
  return {
    transferToggle: () => dispatch(transferToggle()),
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
