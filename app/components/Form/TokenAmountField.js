import React from 'react';
import PropTypes from 'prop-types';

import { InputWithUnit } from '../Input';
import Label from '../Label';
import { ErrorMessage, WarningMessage } from '../FormMessages';

import FormGroup from './FormGroup';
import {
  ControlWrapper,
  FieldGroup,
  Unit,
} from './styles';


class TokenAmountField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { amountFocus: false };
    this.handleAmountFocus = this.handleAmountFocus.bind(this);
    this.handleAmountBlur = this.handleAmountBlur.bind(this);
  }

  handleAmountFocus() {
    this.setState({ amountFocus: true });
  }

  handleAmountBlur() {
    this.setState({ amountFocus: false });
  }

  render() {
    const {
      input,
      label,
      type,
      amountUnit,
      maxAmount,
      meta: { touched, error, warning },
    } = this.props;
    const balanceZero = maxAmount.toString() === '0';
    return (
      <FormGroup>
        <Label htmlFor={input.name}>{label}</Label>
        <ControlWrapper>
          <FieldGroup
            focus={this.state.amountFocus}
            disabled={balanceZero}
          >
            <InputWithUnit
              {...input}
              {...this.props}
              onFocus={this.handleAmountFocus}
              type={type}
              id={input.name}
              disabled={balanceZero}
            />
            <Unit name="unit">{amountUnit}</Unit>
          </FieldGroup>
        </ControlWrapper>

        {touched && error && <ErrorMessage error={error} />}
        {touched && warning && <WarningMessage error={warning} />}
      </FormGroup>
    );
  }
}
TokenAmountField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  type: PropTypes.string,
  meta: PropTypes.object,
  amountUnit: PropTypes.string,
  maxAmount: PropTypes.object,
};

export default TokenAmountField;
