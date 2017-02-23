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
  let data = (<td></td>);
  if (props.values) {
    data = props.values.map((val, i) => {
      if (i === 0) {
        return (<Th key={i}>{val}</Th>);
      }
      return (<Td key={i}>{val}</Td>);
    });
  }
  return (
    <Tr>
      {data}
    </Tr>
  );
}

ListItem.propTypes = {
  values: React.PropTypes.array,
};

export default ListItem;
