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
    const tablesList = tables.map((table) => <tr key={table.id} className="striped--light-gray">
      <td className="pv2 ph3">{table.name}</td>
      <td className="pv2 ph3"><button onClick={this.props.joinTable(table.id)} className="f6 link dim br2 ba ph3 pv2 mb2 dib bg-white dark-green">Join</button></td>
    </tr>);

    return (
      <div className="mw-100 center ph3-ns">
        <div className="cf ph2-ns">
          <div className="fl w-100 w-third-ns pa2">
            <h2 className="f4">My Balance: { this.props.balance }</h2>
            <button onClick={this.props.getTables()} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-black">Refresh Tables</button>
          </div>
          <div className="fl w-100 w-third-ns pa2">
            <table className="collapse ba br2 b--black-10 pv2 ph3">
              <tbody>{ tablesList }</tbody>
            </table>
          </div>
          <div className="fl w-100 w-third-ns pa2">

          </div>
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
    balance: state.LobbyReducer.balance,
    tables: state.LobbyReducer.tables,
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
