import styled from 'styled-components';

export const ButtonContainer = styled.div`
  display: flex;

  & > * {
    flex: 1;
  }

  & > * + * {
    margin-left: 10px;
  }
`;
