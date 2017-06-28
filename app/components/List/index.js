import React, { PropTypes } from 'react';
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

const SortButton = styled.a`
  -webkit-user-select: none;
  cursor: pointer;
  color: inherit;

  span {
    text-decoration: underline;
  }
`;

export const TableStriped = styled(TableStyled)`
  & tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: null, // column index
      sortDir: -1, // 1 — ascending, -1 — descending
    };
  }

  sortedItems() {
    const { items } = this.props;
    const { sortBy, sortDir } = this.state;

    if (items && sortBy) {
      return items.sort((a, b) => (a[sortBy] - b[sortBy]) * sortDir);
    }

    return items;
  }

  handleHeaderClick(i) {
    this.setState(({ sortBy, sortDir }) => ({
      sortBy: i,
      sortDir: sortBy === i ? sortDir * -1 : sortDir,
    }));
  }

  render() {
    const { headers, sortableColumns = [], noDataMsg = 'No Data', columnsStyle = {} } = this.props;
    const { sortBy, sortDir } = this.state;
    const items = this.sortedItems();

    return (
      <div>
        <TableStriped>
          <thead>
            <tr>
              {headers && headers.map((header, i) => {
                const sortable = sortableColumns.indexOf(i) !== -1;
                return (
                  <th key={i} style={columnsStyle[i]}>
                    {!sortable && header}
                    {sortable &&
                      <SortButton onClick={() => this.handleHeaderClick(i)}>
                        <span>{header}</span>
                        {sortBy === i && sortDir === 1 && ' ▲'}
                        {sortBy === i && sortDir === -1 && ' ▼'}
                      </SortButton>
                    }
                  </th>
                );
              })}
              {!headers && <th />}
            </tr>
          </thead>
          {items && items.length > 0 && (
            <tbody>
              {items.map((item, i) => (
                <ListItem
                  key={i}
                  values={item}
                  columnsStyle={columnsStyle}
                />
              ))}
            </tbody>
          )}
        </TableStriped>
        <WithLoading
          isLoading={!items}
          styles={{}}
        >
          {items && items.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              {noDataMsg}
            </div>
          )}
        </WithLoading>
      </div>
    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node),
  headers: PropTypes.arrayOf(PropTypes.node),
  sortableColumns: PropTypes.arrayOf(PropTypes.number),
  columnsStyle: PropTypes.object,
  noDataMsg: PropTypes.string,
};

export default List;
