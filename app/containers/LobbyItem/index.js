import React from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import Button from 'components/Button';
import Link from 'components/Link';

import web3Connect from '../AccountProvider/web3Connect';
import { lineupReceived, updateReceived } from '../Table/actions';
import { fetchTableState } from '../../services/tableService';
import { makeSelectTableData, makeSelectTableLastHandId } from './selectors';
import { ABI_TABLE } from '../../app.config';
import { formatNtz } from '../../utils/amountFormater';

const Tr = styled.tr`
  &:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  vertical-align: top;
  text-align: center;
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

const getTableHand = (props) => fetchTableState(props.tableAddr).then((rsp) => props.updateReceived(props.tableAddr, rsp));

class LobbyItem extends React.PureComponent { // eslint-disable-line

  constructor(props) {
    super(props);
    this.web3 = props.web3Redux.web3;
    this.table = this.web3.eth.contract(ABI_TABLE).at(props.tableAddr);
    getTableData(this.table, props);
    getTableHand(props);
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
    const ta = this.props.tableAddr.substring(2, 8);
    return (
      <Tr>
        <Td key="ta">{ta}</Td>
        <Td key="sb">{formatNtz(this.props.data.smallBlind)} &#x20a6;</Td>
        <Td key="np">{`${players}/${this.props.data.seats.length}`}</Td>
        <Td key="lh">{this.props.lastHandId}</Td>
        <Td key="ac">
          <Link
            to={`/table/${this.props.tableAddr}/hand/${this.props.lastHandId}`}
            size="medium"
            icon="fa fa-eye"
            component={Button}
          />
        </Td>
      </Tr>
    );
  }
}

LobbyItem.propTypes = {
  tableAddr: React.PropTypes.string,
  data: React.PropTypes.object,
  web3Redux: React.PropTypes.any,
  lastHandId: React.PropTypes.number,
};

export function mapDispatchToProps() {
  return {
    lineupReceived: (tableAddr, lineup, smallBlind) => (lineupReceived(tableAddr, lineup, smallBlind)),
    updateReceived: (tableAddr, hand) => (updateReceived(tableAddr, hand)),
  };
}

const mapStateToProps = createStructuredSelector({
  data: makeSelectTableData(),
  lastHandId: makeSelectTableLastHandId(),
});

export default web3Connect(mapStateToProps, mapDispatchToProps)(LobbyItem);
