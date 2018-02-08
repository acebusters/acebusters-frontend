import styled from 'styled-components';

export const ExtraDetail = styled.span`
  font-size: 9px;
  font-weight: normal;

  display: block;
  margin-top: -3px;

  text-transform: uppercase;
  letter-spacing: 1px;

  color: #666;
`;

export const Wrapper = styled.div`
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;

  overflow: auto;
  width: 80%;
  max-height: 100vh;
  padding: 10px;

  opacity: 0.4;

  color: #000;
  background-color: #FFF;

  &:hover {
    opacity: 1;
  }
`;

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  flex: 1;
  margin-right: 30px;
`;

export const Table = styled.table`
  th, td {
    text-align: left;
  }

  th {
    padding: 0 10px;
  }

  td {
    padding: 5px 10px;
    white-space: nowrap;
    vertical-align: top;
  }

  tbody tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
  }

  tbody td:nth-child(${({ columns = 2 }) => `${columns}n + 1`}):not(:last-child),
  tbody th {
    border-right: 1px solid #ccc;
  }

  tfoot tr:first-child {
    border-top: 1px solid #ccc;
  }
`;
