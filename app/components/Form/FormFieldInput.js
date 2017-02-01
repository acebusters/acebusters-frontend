import styled from 'styled-components';

const FormFieldInput = styled.input`
  position: relative;
  padding: 1.625em 16px;
  width: 100%;
  color: $dark-grey;
  border: none;
  outline: 0;
  letter-spacing: 0.05em;

  &:focus {
    background-color: $very-light-grey;
    color: $very-dark-grey;
  }
`;

export default FormFieldInput;