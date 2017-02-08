/**
 * Created by helge on 06.10.16.
 */

import React from 'react';
import { connect } from 'react-redux';
import { getBalance, getTables, joinTable } from './actions';

class LobbyComponent extends React.PureComponent {  // eslint-disable-line

  constructor(props) {
    super(props);
    this.props.getBalance();
    this.props.getTables();
  }

  render() {
    const tables = this.props.tables;
    const tablesList = tables.map((table) => <tr key={table.id}>
      <td>{table.name}</td>
      <td><button onClick={this.props.joinTable(table.id)}>Join</button></td>
    </tr>);

    return (

      <div>
        <div>
          <h2>My Balance: { this.props.balance }</h2>
          <button onClick={this.props.getTables()}>Refresh Tables</button>
        </div>
        <div>
          <table>
            <tbody>{ tablesList }</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    getTables: () => dispatch(getTables()),
    getBalance: () => dispatch(getBalance()),
    joinTable: (id) => dispatch(joinTable(id)),
  };
}

function mapStateToProps(state) {
  return {
    balance: state.lobby.balance,
    tables: state.lobby.tables,
  };
}

LobbyComponent.propTypes = {
  tables: React.PropTypes.array,
  balance: React.PropTypes.number,
  getTables: React.PropTypes.func,
  getBalance: React.PropTypes.func,
  joinTable: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
