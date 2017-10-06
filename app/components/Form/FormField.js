import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from './FormGroup';
import Input from '../Input';
import Label from '../Label';
import { ErrorMessage, WarningMessage } from '../../components/FormMessages';

const FormField = ({ input, label, type, meta: { touched, error, warning }, ...props }) => (
  <FormGroup>
    <Label htmlFor={input.name}>{label}</Label>
    <Input {...input} {...props} type={type} id={input.name} />
    {touched && error && <ErrorMessage error={error} />}
    {touched && warning && <WarningMessage error={warning} />}
  </FormGroup>
);

FormField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  type: PropTypes.string,
  meta: PropTypes.object,
};

export default FormField;
