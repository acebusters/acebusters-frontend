/**
 * Created by helge on 06.10.16.
 */

import React from 'react';
import Button from 'components/Button';
import Container from 'components/Container';
import List from 'components/List';
import H2 from 'components/H2';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { getTables } from './actions';
import { makeSelectLobby } from './selectors';


class LobbyComponent extends React.PureComponent {  // eslint-disable-line

  constructor(props) {
    super(props);
    this.props.getTables();
  }


  showTable(table) {
    browserHistory.push(`/table/${table}/hand/0`);
  }

  tablesToList(tables) {
    let tableList = [];
    if (tables) {
      tableList = tables.map((address, i) => [i, address, (<Button onClick={() => this.showTable(address)}>SHOW</Button>)]);
    }
    return tableList;
  }

  render() {
    if (this.props.lobby.tables) {
      const tables = this.props.lobby.tables.tableContracts;
      return (
        <Container>
          <H2> Table Overview </H2>
          <List items={this.tablesToList(tables)} headers={['#', 'address', 'Action']}></List>
          <Button onClick={this.props.getTables}>Refresh Tables</Button>
        </Container>
      );
    }
    return null;
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    getTables: () => dispatch(getTables()),
  };
}

const mapStateToProps = createStructuredSelector({
  lobby: makeSelectLobby(),
});

LobbyComponent.propTypes = {
  lobby: React.PropTypes.object,
  getTables: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
