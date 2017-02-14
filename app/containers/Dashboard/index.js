import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';

import makeSelectAccountData, { makeSelectContract, makeSelectAddress } from '../AccountProvider/selectors';
import messages from './messages';
import Teleport from '../Teleport';
import { Modal } from '../Teleport/modal';
import { setBalance } from '../AccountProvider/actions';

const openModal = () => Teleport.init(<Modal>Some text</Modal>);

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
        <div>
          address: {this.props.address}
          <QRCode value={qrUrl} />
        </div>
        <div>
          balance: {this.props.account.balance}
        </div>
        <ul>
          <button onClick={openModal}>Transfer</button>
        </ul>
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
