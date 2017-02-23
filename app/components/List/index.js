import React from 'react';
import styled from 'styled-components';
import ListItem from '../ListItem';

const Table = styled.table`
  border-collapse: collapse;
  background-color: transparent;
`;

const TableStyled = styled(Table)`
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  & th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #eceeef;
  }
  & thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #eceeef;
  }
  & tbody + tbody {
    border-top: 2px solid #eceeef;
  }
  & & {
    background-color: #fff;
  }
`;

const TableStriped = styled(TableStyled)`
  & tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

function List(props) {
  let content = (<tr></tr>);

  // If we have items, render them
  if (props.items && props.items.pending) {
    content = Object.keys(props.items.pending).map((key) => (
      <ListItem key={key} nonce={key} item={props.items.pending[key]} />
    ));
  }
  return (
    <TableStriped>
      <thead>
        <tr>
          <th>#</th>
          <th>data</th>
          <th>TxHash</th>
        </tr>
      </thead>
      <tbody>
        {content}
      </tbody>
    </TableStriped>
  );
}

List.propTypes = {
  items: React.PropTypes.any,
};

export default List;
