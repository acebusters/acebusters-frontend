import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import web3Connect from '../AccountProvider/web3Connect';

import makeSelectAccountData from '../AccountProvider/selectors';
import messages from './messages';
import { txnsToList } from './txnsToList';
import { createDashboardTxsSelector } from './selectors';

import OverviewComponent from '../../components/Dashboard/Overview';
import { ABI_TABLE_FACTORY, conf } from '../../app.config';

const confParams = conf();

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.web3 = props.web3Redux.web3;
    this.tableFactory = this.web3.eth.contract(ABI_TABLE_FACTORY).at(confParams.tableFactory);
    this.tableFactory.getTables.call();
  }

  render() {
    const { account } = this.props;

    return (
      <OverviewComponent
        messages={messages}
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

const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
  dashboardTxs: createDashboardTxsSelector(),
});

export default web3Connect(
  mapStateToProps,
)(Overview);
