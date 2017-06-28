import styled from 'styled-components';

export const typeIcons = {
  income: '▲',
  outcome: '▼',
};

export const Section = styled.div`
  padding-bottom: 20px;

  & + & {
    border-top: 1px solid #ccc;
  }
`;

export const TypeIcon = styled.i`
  color: ${(props) => props.children === typeIcons.income ? '#43ba67' : '#da0a16'};
`;

export const Icon = styled.i``;
