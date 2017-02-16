import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import makeSelectAccountData, { makeAddressSelector } from '../AccountProvider/selectors';
import messages from './messages';
import { transferToggle } from '../App/actions';
import web3Connect from '../AccountProvider/web3Connect';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleGetBlockNumber = this.handleGetBlockNumber.bind(this);
  }

  handleGetBlockNumber() {
    this.props.web3Redux.web3.eth.getBlockNumber();
  }

  render() {
    const qrUrl = `ether:${this.props.address}`;
    const web3 = this.props.web3Redux.web3;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <div>
          last block: {web3.eth.blockNumber()}
          <br />
          <button onClick={this.handleGetBlockNumber}>getBlockNumber</button>
        </div>
        <div>
          address: {this.props.address}
          <QRCode value={qrUrl} />
        </div>
        <div>
          balance: {this.props.account.balance}
        </div>
        <button onClick={this.props.transferToggle}>Transfer</button>
      </div>
    );
  }
}

Dashboard.propTypes = {
  transferToggle: PropTypes.func,
  account: PropTypes.any,
  web3Redux: PropTypes.any,
  address: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  makeAddressSelector(),
  (account, address) => ({
    account,
    address,
  })
);


function mapDispatchToProps(dispatch) {
  return {
    transferToggle: () => dispatch(transferToggle()),
  };
}

export default web3Connect(mapStateToProps, mapDispatchToProps)(Dashboard);
