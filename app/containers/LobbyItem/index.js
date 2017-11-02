import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import Button from 'components/Button';
import Link from 'components/Link';

import { makeSelectTableData, makeSelectTableLastHandId } from './selectors';
import { formatNtz } from '../../utils/amountFormatter';
import { tableNameByAddress } from '../../services/tableNames';

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
    const { data, tableAddr, lastHandId } = this.props;
    if (!data || !data.seats) {
      return (<tr />);
    }
    const players = data.seats.filter((seat) => (
      seat && seat.address &&
      seat.address.length >= 40 && seat.address !== ADDR_EMPTY
    )).length;
    const sb = data.smallBlind;
    const bb = sb * 2;

    return (
      <Tr>
        <Td key="ta" style={{ textAlign: 'left' }}>
          {tableAddr.substr(2, 6)}
        </Td>
        <Td key="tn" style={{ textAlign: 'left' }}>
          <Link to={`/table/${tableAddr}`}>
            {tableNameByAddress(tableAddr)}
          </Link>
        </Td>
        <Td key="sb">{formatNtz(sb)} NTZ / {formatNtz(bb)} NTZ</Td>
        <Td key="np">{`${players}/${data.seats.length}`}</Td>
        <Td key="lh">{lastHandId}</Td>
        <Td key="ac">
          <Link
            to={`/table/${tableAddr}`}
          >
            <Button icon="fa fa-eye" size="small" />
          </Link>
        </Td>
      </Tr>
    );
  }
}

LobbyItem.propTypes = {
  tableAddr: PropTypes.string,
  data: PropTypes.object,
  lastHandId: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectTableData(),
  lastHandId: makeSelectTableLastHandId(),
});

export default connect(mapStateToProps)(LobbyItem);
