import React from 'react';
import styled from 'styled-components';

const Tr = styled.tr`
  &:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Th = styled.th`
  text-align: left;
  color: #464a4c;
`;

//   background-color: #eceeef;

const Td = styled.td`
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #eceeef;
`;

function ListItem(props) {
  return (
    <Tr>
      <Th>{props.nonce}</Th>
      <Td key={'data'}>{props.item.data}</Td>
      <Td key={'hash'}>{(props.item.txHash) ? (props.item.txHash) : props.item.error}</Td>
    </Tr>
  );
}

ListItem.propTypes = {
  item: React.PropTypes.any,
  nonce: React.PropTypes.any,
};

export default ListItem;
