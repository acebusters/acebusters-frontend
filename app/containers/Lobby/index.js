import React from 'react';
import PropTypes from 'prop-types';
import Lobby from 'components/Lobby';
import { createStructuredSelector } from 'reselect';
import { tableReceived, lineupReceived, updateReceived } from '../Table/actions';
import { makeSelectLobby } from './selectors';
import web3Connect from '../AccountProvider/web3Connect';

import { fetchTableState, fetchTables } from '../../services/tableService';
import { ABI_TABLE } from '../../app.config';

async function getTableData(table, action) {
  const [lineup, sb, blindLevelDuration] = await Promise.all([
    table.getLineup.callPromise(),
    table.smallBlind.callPromise(0),
    table.blindLevelDuration.callPromise(),
  ]);

  action(table.address, lineup, undefined, undefined, sb, blindLevelDuration);
}

const getTableHand = (tableAddr, action) => fetchTableState(tableAddr).then((rsp) => action(tableAddr, rsp));

class LobbyContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.web3 = props.web3Redux.web3;
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.handleRefresh();
  }

  async handleRefresh() {
    this.setState({ refreshing: true });
    try {
      const tables = await fetchTables();
      if (tables) {
        await Promise.all(tables.map((tableAddr) => {
          const contract = this.web3.eth.contract(ABI_TABLE).at(tableAddr);
          this.props.tableReceived(tableAddr);

          return Promise.all([
            getTableData(contract, this.props.lineupReceived),
            getTableHand(tableAddr, this.props.updateReceived),
          ]);
        }));
      }
    } finally {
      this.setState({ refreshing: false });
    }
  }

  render() {
    return (
      <Lobby
        refreshing={this.state.refreshing}
        handleRefresh={this.handleRefresh}
        {...this.props}
      />
    );
  }
}
LobbyContainer.propTypes = {
  web3Redux: PropTypes.any,
  tableReceived: PropTypes.func,
  updateReceived: PropTypes.func,
  lineupReceived: PropTypes.func,
};

export function mapDispatchToProps() {
  return {
    tableReceived,
    lineupReceived,
    updateReceived,
  };
}

const mapStateToProps = createStructuredSelector({
  lobby: makeSelectLobby(),
});

export default web3Connect(mapStateToProps, mapDispatchToProps)(LobbyContainer);
