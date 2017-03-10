import React from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import Button from 'components/Button';

import web3Connect from '../AccountProvider/web3Connect';
import { lineupReceived } from '../Table/actions';
import { makeSelectTableData } from './selectors';
import { ABI_TABLE } from '../../app.config';

const Tr = styled.tr`
  &:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

//   background-color: #eceeef;

const Td = styled.td`
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #eceeef;
`;

const ADDR_EMPTY = '0x0000000000000000000000000000000000000000';

const getTableData = (table, props) => {
  const lineup = table.getLineup.callPromise();
  const sb = table.smallBlind.callPromise();
  return Promise.all([lineup, sb]).then((rsp) => {
    props.lineupReceived(table.address, rsp[0], rsp[1]);
    return Promise.resolve();
  });
};

class LobbyItem extends React.PureComponent {  // eslint-disable-line

  constructor(props) {
    super(props);
    this.handleView = this.handleView.bind(this);
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(props.tableAddr);
    getTableData(this.table, props);
  }

  handleView() {
    browserHistory.push(`/table/${this.props.tableAddr}/hand/${this.props.data.lastHandNetted + 1}`);
  }

  render() {
    if (!this.props.data || !this.props.data.seats) {
      return (<tr />);
    }
    let players = 0;
    this.props.data.seats.forEach((seat) => {
      if (seat && seat.address &&
        seat.address.length >= 40 && seat.address !== ADDR_EMPTY) {
        players += 1;
      }
    });
    return (
      <Tr>
        <Td key={this.props.number}>{this.props.number}</Td>
        <Td key="sb">{this.props.data.smallBlind}</Td>
        <Td key="np">{`${players}/${this.props.data.seats.length}`}</Td>
        <Td key="lh">{this.props.data.lastHandNetted}</Td>
        <Td key="ac"><Button onClick={this.handleView}>SHOW</Button></Td>
      </Tr>
    );
  }
}

LobbyItem.propTypes = {
  tableAddr: React.PropTypes.string,
  data: React.PropTypes.object,
  web3Redux: React.PropTypes.any,
  number: React.PropTypes.number,
};

export function mapDispatchToProps() {
  return {
    lineupReceived: (tableAddr, lineup, smallBlind) => (lineupReceived(tableAddr, lineup, smallBlind)),
  };
}

const mapStateToProps = createStructuredSelector({
  data: makeSelectTableData(),
});

export default web3Connect(mapStateToProps, mapDispatchToProps)(LobbyItem);
