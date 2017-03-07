import React from 'react';
import styled from 'styled-components';

const FormError = styled.span`
  margin: 0;
  padding: 0.5em 1em;
  font-size: 0.8em;
  font-family: $text-font-stack;
  float: left;
  width: 100%;
`;

function ErrorMessage(props) {
  return (
    <FormError>
      {props.error}
    </FormError>
  );
}

ErrorMessage.propTypes = {
  error: React.PropTypes.string,
};

export default ErrorMessage;
