import styled from 'styled-components';

export const Section = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 20px 0;
  padding: 20px 0;
  &:first-child {
    padding-top: 0;
    margin-top: 0;
  }
`;
