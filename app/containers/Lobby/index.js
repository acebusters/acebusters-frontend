/**
 * Created by helge on 06.10.16.
 */

import React from 'react';
import Grid from 'grid-styled';
import { connect } from 'react-redux';
import Button from 'components/Button';
import Container from 'components/Container';
import { TableStriped } from 'components/List';
import H2 from 'components/H2';
import { createStructuredSelector } from 'reselect';
import LobbyItem from '../LobbyItem';
import { tableReceived } from '../Table/actions';
import { makeSelectLobby } from './selectors';
import { fetchTables } from '../../services/tableService';


class LobbyComponent extends React.PureComponent {  // eslint-disable-line

  constructor(props) {
    super(props);
    this.handleGetTables = this.handleGetTables.bind(this);
    this.handleGetTables();
  }

  handleGetTables() {
    fetchTables().then((tables) => {
      if (tables) {
        tables.forEach((tableAddr) => this.props.tableReceived(tableAddr));
      }
    });
  }

  render() {
    let content = [];
    if (this.props.lobby) {
      content = this.props.lobby.map((tableAddr, i) =>
        <LobbyItem key={i} tableAddr={tableAddr} />
      );
    }
    return (
      <Container>
        <H2> Table Overview </H2>

        <TableStriped>
          <thead>
            <tr>
              <th key="number"> # </th>
              <th key="blind"> Blind </th>
              <th key="play"> Players </th>
              <th key="hand"> Hand </th>
              <th key="actn"> Action </th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </TableStriped>
        <Grid xs={1 / 4} >
          <div style={{ float: 'left' }}>
            <Button onClick={this.handleGetTables} size="medium" icon="fa fa-refresh">REFRESH</Button>
          </div>
        </Grid>
        <Grid xs={3 / 4}>
        </Grid>
      </Container>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    tableReceived: (tableAddr) => dispatch(tableReceived(tableAddr)),
  };
}

const mapStateToProps = createStructuredSelector({
  lobby: makeSelectLobby(),
});

LobbyComponent.propTypes = {
  lobby: React.PropTypes.array,
  tableReceived: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyComponent);
