import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import { Receipt, Type } from 'poker-helper';

import account from '../../services/account';
import * as storageService from '../../services/localStorage';

// components
import FormGroup from '../../components/Form/FormGroup';
import Container from '../../components/Container';
import { ErrorMessage, WarningMessage } from '../../components/FormMessages';
import Input from '../../components/Input';
import Label from '../../components/Label';
import Button from '../../components/Button';
import H1 from '../../components/H1';

const validate = (values) => {
  const errors = {};
  if (!values.get('confCode')) {
    errors.confCode = 'Required';
  } else {
    let receipt;
    const confCode = decodeURIComponent(values.get('confCode'));
    try {
      receipt = Receipt.parse(confCode);
    } catch (err) {
      errors.confCode = `Invalid confirmation code: ${err.message}`;
    }
    if (receipt.type !== Type.CREATE_CONF &&
      receipt.type !== Type.RESET_CONF) {
      errors.confCode = `Invalid receipt type: ${receipt.type}`;
    }
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

/* eslint-disable react/prop-types */
const renderField = ({ placeholder, input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <Label htmlFor={input.name}>{label}</Label>
    <Input {...input} placeholder={placeholder} type={type} />
    {touched && ((error && <ErrorMessage error={error} />) || (warning && <WarningMessage warning={warning}></WarningMessage>))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class ConfirmPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const confCode = decodeURIComponent(values.get('confCode'));
    const receipt = Receipt.parse(confCode);
    if (receipt.type === Type.CREATE_CONF) {
      return account.confirm(confCode).catch((err) => {
        const errMsg = 'Email Confirmation failed!';
        if (err === 409) {
          throw new SubmissionError({ confCode: 'Email already confirmed.', _error: errMsg });
        } else {
          throw new SubmissionError({ _error: `Email Confirmation failed with error code ${err}` });
        }
      }).then(() => {
        storageService.setItem('ab-confCode', values.get('confCode'));
        browserHistory.push('/generate');
      });
    }
    if (receipt.type === Type.RESET_CONF) {
      storageService.setItem('ab-confCode', values.get('confCode'));
      browserHistory.push('/generate');
      return Promise.resolve({});
    }
    throw new SubmissionError({ _error: 'Unknown receipt type' });
  }

  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <Container>
        <H1>Please confirm your registration!</H1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="confCode" component={renderField} type="text" placeholder="code" label="Please enter the code you received via email:" />
          {error && <strong>{error}</strong>}
          <Button type="submit" size="large" disabled={submitting}>
            { (!submitting) ? 'Submit' : 'Please wait ...' }
          </Button>
        </Form>
      </Container>
    );
  }
}

ConfirmPage.propTypes = {
  ...propTypes,
  dispatch: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  error: PropTypes.any,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    confCode: ownProps.params.confCode,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'confirm', validate, warn })(ConfirmPage));
