import styled from 'styled-components';

import Button from '../../components/Button';

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

export const DBButton = styled(Button)`
  @media (max-width: 500px) {
    display: block;

    & + & {
      margin-left: 0;
      margin-top: 15px;
    }
  }
`;

export const Address = styled.p`
  overflow-y: auto;
  padding: 10px 0;
  margin: -10px -30px 0 0;
`;

export const Icon = styled.i``;
