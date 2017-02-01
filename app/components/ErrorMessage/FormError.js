import styled from 'styled-components';

const FormError = styled.p`
  background-color: $error-color;
  color: white;
  margin: 0;
  padding: 0.5em 1em;
  font-size: 0.8em;
  font-family: $text-font-stack;
  user-select: none;
`;

export default FormError;