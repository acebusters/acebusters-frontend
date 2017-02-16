import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import makeSelectAccountData, { makeSelectContract, makeAddressSelector } from '../AccountProvider/selectors';
import messages from './messages';
import { transferToggle } from '../App/actions';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
  }

  render() {
    const qrUrl = `ether:${this.props.address}`;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <div>
          address: {this.props.address}
          <QRCode value={qrUrl} />
        </div>
        <div>
          balance: {this.props.account.balance}
        </div>
        <ul>
          <button onClick={this.props.transferToggle}>Transfer</button>
        </ul>
      </div>
    );
  }
}

Dashboard.propTypes = {
  transferToggle: PropTypes.func,
  account: PropTypes.any,
  address: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  makeSelectContract(),
  makeAddressSelector(),
  (account, contract, address) => ({
    account,
    contract,
    address,
  })
);


function mapDispatchToProps(dispatch) {
  return {
    transferToggle: () => dispatch(transferToggle()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
