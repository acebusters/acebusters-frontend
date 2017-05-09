import React from 'react';
import styled from 'styled-components';
import WithLoading from '../WithLoading';
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

export const TableStriped = styled(TableStyled)`
  & tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

function List(props) {
  let content = (<tr></tr>);
  let headers = (<th></th>);

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item) => (
      <ListItem key={item} values={item} />
    ));
  }

  if (props.headers) {
    headers = props.headers.map((header) => (
      <th key={header} > {header} </th>
    ));
  }

  return (
    <div>
      <TableStriped>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        {props.items && props.items.length > 0 && (
          <tbody>
            {content}
          </tbody>
        )}
      </TableStriped>
      <WithLoading
        isLoading={props.items === null || props.items === undefined}
        styles={{}}
      >
        {props.items && props.items.length === 0 && (
          <div style={{ textAlign: 'center' }}>{props.noDataMsg || 'No Data'}</div>
        )}
      </WithLoading>
    </div>
  );
}

List.propTypes = {
  items: React.PropTypes.any,
  headers: React.PropTypes.any,
  noDataMsg: React.PropTypes.string,
};

export default List;
