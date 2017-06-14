import styled from 'styled-components';

export const Section = styled.div`
  & + & {
    margin-top: 20px;
    border-top: 1px solid #ccc;
  }
`;
