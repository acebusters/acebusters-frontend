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
  text-align: center;
  border-top: 1px solid #eceeef;
`;

function ListItem({ values, columnsStyle = {} }) {
  return (
    <Tr>
      {!values && <td />}
      {values && values.map((val, i) => {
        const Comp = i === 0 ? Th : Td;
        return (
          <Comp
            key={i}
            style={columnsStyle[i]}
          >
            {typeof val === 'number'
              ? String(val).replace(/^-/, '−')
              : val
            }
          </Comp>
        );
      })}
    </Tr>
  );
}

ListItem.propTypes = {
  values: React.PropTypes.array,
  columnsStyle: React.PropTypes.object,
};

export default ListItem;
