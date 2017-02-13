import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import makeSelectAccountData, { makeSelectContract, makeSelectAddress } from '../AccountProvider/selectors';
import messages from './messages';
import { setBalance } from '../AccountProvider/actions';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.contract.balanceOf(this.props.address, (err, bal) => {
      if (err) {
        console.dir(err);
        return;
      }
      this.props.setBalance(bal.toNumber());
    });
  }

  render() {
    const qrUrl = `ether:${this.props.address}`;
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <QRCode value={qrUrl} />
        <div>
          {this.props.account.balance}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  setBalance: PropTypes.func,
  account: PropTypes.any,
  contract: PropTypes.any,
  address: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectAccountData(),
  makeSelectContract(),
  makeSelectAddress(),
  (account, contract, address) => ({
    account,
    contract,
    address,
  })
);


function mapDispatchToProps(dispatch) {
  return {
    setBalance: (newBal) => dispatch(setBalance(newBal)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
