/**
 * Created by helge on 06.10.16.
 */

import React from 'react';
import Button from 'components/Button';
import Container from 'components/Container';
import { TableStriped } from 'components/List';
import H2 from 'components/H2';
import { createStructuredSelector } from 'reselect';
import LobbyItem from '../LobbyItem';
import { tableReceived, lineupReceived, updateReceived } from '../Table/actions';
import { makeSelectLobby } from './selectors';
import web3Connect from '../AccountProvider/web3Connect';
import WithLoading from '../../components/WithLoading';
import { fetchTableState, fetchTables } from '../../services/tableService';

import { ABI_TABLE } from '../../app.config';

async function getTableData(table, action) {
  const [lineup, sb] = await Promise.all([
    table.getLineup.callPromise(),
    table.smallBlind.callPromise(),
  ]);

  action(table.address, lineup, sb);
}

const getTableHand = (tableAddr, action) => fetchTableState(tableAddr).then((rsp) => action(tableAddr, rsp));

class LobbyComponent extends React.PureComponent { // eslint-disable-line

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
    const { refreshing } = this.state;
    const { lobby } = this.props;

    return (
      <Container>
        <H2> Table Overview </H2>

        <TableStriped>
          <thead>
            <tr>
              <th key="number">#</th>
              <th key="blind">Blinds</th>
              <th key="play">Players </th>
              <th key="hand">Hand</th>
              <th key="actn" />
            </tr>
          </thead>
          {lobby && lobby.length > 0 && (
            <tbody>
              {lobby.map((tableAddr, i) =>
                <LobbyItem key={i} tableAddr={tableAddr} />
              )}
            </tbody>
          )}
        </TableStriped>

        <WithLoading
          isLoading={lobby.length === 0}
        />

        <Button onClick={this.handleRefresh} size="medium">
          Refresh
          <WithLoading
            isLoading={refreshing}
            loadingSize="14px"
            type="inline"
            styles={{
              inner: { marginLeft: 5 },
            }}
          />
        </Button>
      </Container>
    );
  }
}

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

LobbyComponent.propTypes = {
  lobby: React.PropTypes.array,
  web3Redux: React.PropTypes.any,
  tableReceived: React.PropTypes.func,
  updateReceived: React.PropTypes.func,
  lineupReceived: React.PropTypes.func,
};

export default web3Connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
