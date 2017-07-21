import styled from 'styled-components';

import Button from '../../components/Button';

export const typeIcons = {
  income: '▲',
  outcome: '▼',
};

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

export const Icon = styled.i``;
