import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import web3Connect from '../AccountProvider/web3Connect';
import { notifyCreate } from '../Notifications/actions';

import makeSelectAccountData from '../AccountProvider/selectors';
import { toggleInvestTour } from './actions';
import messages from './messages';
import { txnsToList } from './txnsToList';
import {
  createDashboardTxsSelector,
  createPendingETHPayoutSelector,
  createPendingABPPayoutSelector,
} from './selectors';

import OverviewComponent from '../../components/Dashboard/Overview';
import { ABI_TOKEN_CONTRACT, ABI_TABLE_FACTORY, conf } from '../../app.config';

const confParams = conf();

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.web3 = props.web3Redux.web3;
    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(confParams.ntzAddr);
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);
    this.tableFactory.getTables.call();
  }

  render() {
    const { account } = this.props;

    return (
      <OverviewComponent
        account={account}
        messages={messages}
        babzBalance={this.token.balanceOf(account.signerAddr)}
        listTxns={txnsToList(
          this.props.dashboardTxs,
          this.tableFactory.getTables(),
          account.signerAddr
        )}
      />
    );
  }
}
Overview.propTypes = {
  account: PropTypes.object,
  dashboardTxs: PropTypes.array,
  web3Redux: PropTypes.any,
};

const mapDispatchToProps = (dispatch) => ({
  toggleInvestTour,
  notifyCreate: (type, props) => dispatch(notifyCreate(type, props)),
});

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  dashboardTxs: createDashboardTxsSelector(),
  pendingETHPayout: createPendingETHPayoutSelector(),
  pendingABPPayout: createPendingABPPayoutSelector(),
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(Overview);

