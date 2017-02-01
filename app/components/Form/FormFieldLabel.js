import styled from 'styled-components';

const FormFieldLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  padding-top: 20px;
  padding-bottom: 0;
  margin: 0;
  z-index: 1;
  font-size: .8em;
  color: $mid-grey;
  font-weight: 400;
  user-select: none;
  cursor: text;
`;

export default FormFieldLabel;