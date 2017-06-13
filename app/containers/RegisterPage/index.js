import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Field, reduxForm, SubmissionError, propTypes, stopAsyncValidation, startAsyncValidation, change } from 'redux-form/immutable';
import { browserHistory } from 'react-router';

// components
import Container from '../../components/Container';
import FormGroup from '../../components/Form/FormGroup';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import { ErrorMessage, WarningMessage } from '../../components/FormMessages';

import { setProgress } from '../App/actions';
import account from '../../services/account';
import { conf } from '../../app.config';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const refRegex = /^[0-9a-f]{8}$/i;

const validate = (values) => {
  const errors = {};
  if (!values.get('email')) {
    errors.email = 'Required';
  } else if (!emailRegex.test(values.get('email'))) {
    errors.email = 'Invalid email address.';
  }
  if (!values.get('captchaResponse')) {
    errors.captchaResponse = 'Required';
  }

  const referral = values.get('referral') || '';
  if (!refRegex.test(referral)) {
    if (!values.has('defaultRef') && referral.length === 0) {
      errors.referral = 'Referral code is required';
    } else if (referral.length > 0) {
      errors.referral = 'Referral code must have 8 letters';
    }
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

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <Label htmlFor={input.name}>{label}</Label>
    <Input {...input} placeholder={label} type={type} />
    {touched && ((error && <ErrorMessage error={error} />) || (warning && <WarningMessage warning={warning} />))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class RegisterPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReferralChange = this.handleReferralChange.bind(this);

    const defaultRefCode = conf().defaultRefCode;
    account.checkReferral(defaultRefCode).then((response) => {
      if (response.defaultRef) {
        this.props.dispatch(change('register', 'defaultRef', defaultRefCode));
      }
    });
  }

  handleSubmit(values) {
    // Note: auto increase progress for 3 seconds;
    this.props.setProgress(-3000);

    return account.register(
      values.get('email'),
      values.get('captchaResponse'),
      window.location.origin,
      values.get('referral') || values.get('defaultRef')
    ).catch((err) => {
      // If store account failed, ...
      const errMsg = 'Registration failed!';
      if (err === 409) {
        throw new SubmissionError({ email: 'Email taken.', _error: errMsg });
      } else {
        throw new SubmissionError({ _error: `Registration failed with error code ${err}` });
      }
    }).then(() => {
      this.props.setProgress(100);
      // If store account success, ...
      browserHistory.push('/confirm');
    });
  }

  handleReferralChange(e, value/* , prevValue*/) {
    if (value.length === 8) {
      this.defaultRef = undefined;
      this.props.dispatch(startAsyncValidation('register'));
      account
        .checkReferral(value)
        .then((response) => {
          if (response.defaultRef) {
            this.defaultRef = response.defaultRef;
          }
          return null;
        })
        .catch((err) => {
          switch (err) {
            case 400:
            case 404:
              return 'Invalid referral code';
            case 418:
              return 'Referral code is no longer available';
            case 420:
              return 'Sorry, signup limit reached, try to signup later';
            default:
              return null;
          }
        })
        .then((error) => {
          this.props.dispatch(
            stopAsyncValidation(
              'register',
              error ? { referral: error } : {},
            )
          );
        });
    }
  }

  render() {
    const { error, handleSubmit, invalid, submitting, asyncValidating } = this.props;

    return (
      <Container>
        <div>
          <H1>Register a new account!</H1>
          <Form
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Field name="email" type="text" component={renderField} label="e-mail" />
            <Field
              name="referral"
              type="text"
              component={renderField}
              label="referral code"
              onChange={this.handleReferralChange}
            />
            <Field name="captchaResponse" component={Captcha} />
            {error && <ErrorMessage error={error} />}
            <Button type="submit" disabled={submitting || invalid || asyncValidating} size="large">
              { (!submitting) ? 'Register' : 'Please wait ...' }
            </Button>
          </Form>
        </div>
      </Container>
    );
  }
}

RegisterPage.propTypes = {
  ...propTypes,
  input: React.PropTypes.any,
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
export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'register',
    validate,
    // asyncValidate,
    // asyncBlurFields: [],
    warn,
  })(RegisterPage)
);
