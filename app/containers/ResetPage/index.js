import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Field, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
// components
import Container from '../../components/Container';
import FormField from '../../components/Form/FormField';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import { ErrorMessage } from '../../components/FormMessages';

import { setProgress } from '../App/actions';
import * as accountService from '../../services/account';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = (values) => {
  const errors = {};
  if (!values.get('email')) {
    errors.email = 'Required';
  } else if (!emailRegex.test(values.get('email'))) {
    errors.email = 'Invalid email address.';
  } else if (values.get('email').length >= 256) {
    errors.email = 'Email address must be less than 256 characters.';
  }
  if (!values.get('captchaResponse')) {
    errors.captchaResponse = 'Required';
  }
  return errors;
};

const warn = (values) => {
  const warnings = {};
  values.get('email');
  return warnings;
};

/* eslint-disable react/prop-types */
const Captcha = (props) => (
  <div style={{ marginBottom: '15px' }}>
    <ReCAPTCHA
      sitekey={'6LcE0RQUAAAAAEf6UWFsHEPedPBmRPAQiaSiWynN'}
      onChange={props.input.onChange}
    />
  </div>
);
/* eslint-enable react/prop-types */

export class ResetPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    // Note: auto increase progress for 3 seconds;
    this.props.setProgress(-3000);

    return accountService.reset(values.get('email'), values.get('captchaResponse'), window.location.origin).catch((err) => {
      // If store account failed, ...
      const errMsg = 'Reset failed!';
      if (err.status && err.status === 404) {
        throw new SubmissionError({ email: 'Email not found.', _error: errMsg });
      } else {
        throw new SubmissionError({ _error: `Reset failed with error code ${err}` });
      }
    }).then(() => {
      this.props.setProgress(100);
      // If store account success, ...
      browserHistory.push('/confirm');
    });
  }

  render() {
    const { error, handleSubmit, invalid, submitting } = this.props;

    return (
      <Container>
        <div>
          <H1> Reset existing account!</H1>
          <Form
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Field name="email" type="text" component={FormField} label="e-mail" />
            <Field name="captchaResponse" component={Captcha} />
            {error && <ErrorMessage error={error} />}
            <Button type="submit" disabled={submitting || invalid} size="large">
              { (!submitting) ? 'Reset' : 'Please wait ...' }
            </Button>
          </Form>
        </div>
      </Container>
    );
  }
}

ResetPage.propTypes = {
  ...propTypes,
  input: PropTypes.any,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setProgress: (percent) => dispatch(setProgress(percent)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = () => ({});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'reset', validate, warn })(ResetPage));
