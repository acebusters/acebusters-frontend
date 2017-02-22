import React from 'react';
import styled from 'styled-components';

const Th = styled.th`
  text-align: left;
  color: #464a4c;
  background-color: #eceeef;
`;

const Td = styled.td`
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #eceeef;
`;

function ListItem(props) {
  return (
    <tr>
      <Th>{props.nonce}</Th>
      <Td key={'data'}>{props.item.data}</Td>
      <Td key={'hash'}>{props.item.txHash}</Td>
    </tr>
  );
}

ListItem.propTypes = {
  item: React.PropTypes.any,
  nonce: React.PropTypes.any,
};

export default ListItem;
