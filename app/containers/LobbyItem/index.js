import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import Button from 'components/Button';
import Link from 'components/Link';

import { makeSelectTableData, makeSelectTableLastHandId } from './selectors';
import { formatNtz } from '../../utils/amountFormatter';

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

class LobbyItem extends React.PureComponent { // eslint-disable-line

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
    const sb = this.props.data.smallBlind;
    const bb = sb * 2;
    return (
      <Tr>
        <Td key="ta">{this.props.tableAddr.substring(2, 8)}</Td>
        <Td key="sb">{formatNtz(sb)} NTZ / {formatNtz(bb)} NTZ</Td>
        <Td key="np">{`${players}/${this.props.data.seats.length}`}</Td>
        <Td key="lh">{this.props.lastHandId}</Td>
        <Td key="ac">
          <Link
            to={`/table/${this.props.tableAddr}`}
            size="small"
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
  lastHandId: React.PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectTableData(),
  lastHandId: makeSelectTableLastHandId(),
});

export default connect(mapStateToProps)(LobbyItem);
