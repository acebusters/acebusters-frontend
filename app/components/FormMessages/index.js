import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  baseColor,
  black,
} from '../../variables';

const FormError = styled.span`
  margin: 0;
  padding: 0.5em 1em;
  font-size: 0.8em;
  font-family: $text-font-stack;
  float: left;
  color: ${baseColor};
  width: 100%;
`;

const FormWarning = styled.span`
  margin: 0;
  padding: 0.5em 1em;
  font-size: 0.8em;
  font-family: $text-font-stack;
  float: left;
  color: ${black};
  width: 100%;
`;

export function ErrorMessage(props) {
  return (
    <FormError>
      <strong>{props.error}</strong>
    </FormError>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export function WarningMessage(props) {
  return (
    <FormWarning>
      <strong>{props.warning}</strong>
    </FormWarning>
  );
}

WarningMessage.propTypes = {
  warning: React.PropTypes.string,
};
