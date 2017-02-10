/**
 * Created by helge on 06.10.16.
 */

import React from 'react';
import Button from 'components/Button';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { getBalance, getTables, joinTable } from './actions';
import { makeSelectAddress } from '../AccountProvider/selectors';
import { makeSelectLobby } from './selectors';


class LobbyComponent extends React.PureComponent {  // eslint-disable-line

  constructor(props) {
    super(props);
    this.props.getBalance(this.props.myAddress);
    this.props.getTables();
  }

  render() {
    if (this.props.lobby.tables) {
      const tables = this.props.lobby.tables.tableContracts;
      const tablesList = tables.map((table) => (
        <tr key={table}>
          <td>{table}</td>
          <td>
            <Button value={table} onClick={this.props.joinTable}>Join</Button>
          </td>
        </tr>));

      return (
        <div>
          <h2>My Balance: { this.props.lobby.balance }</h2>
          <Button onClick={this.props.getTables}>Refresh Tables</Button>
          <table>
            <tbody>{ tablesList }</tbody>
          </table>
        </div>
      );
    }
    return null;
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    getTables: () => dispatch(getTables()),
    getBalance: (myAddress) => dispatch(getBalance(myAddress)),
    joinTable: (id) => dispatch(joinTable(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  myAddress: makeSelectAddress(),
  lobby: makeSelectLobby(),
});

LobbyComponent.propTypes = {
  myAddress: React.PropTypes.any,
  lobby: React.PropTypes.object,
  getTables: React.PropTypes.func,
  getBalance: React.PropTypes.func,
  joinTable: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
