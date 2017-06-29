import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Field, reduxForm, propTypes } from 'redux-form/immutable';
import { FormattedMessage } from 'react-intl';

// components
import Container from '../../components/Container';
import FormGroup from '../../components/Form/FormGroup';
import FormField from '../../components/Form/FormField';
import Label from '../../components/Label';
import { CheckBox } from '../../components/Input';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import { ErrorMessage, WarningMessage } from '../../components/FormMessages';
import messages from './messages';

import { register } from './actions';

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

  if (!values.get('terms')) {
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

const renderCheckBox = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <CheckBox {...input} placeholder={label} type={type} />
    <Label htmlFor={input.name}><FormattedMessage {...messages.terms.agree} /> {label}</Label>
    {touched && ((error && <ErrorMessage error={error} />) || (warning && <WarningMessage warning={warning} />))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class RegisterPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.register({
      email: values.get('email'),
      captchaResponse: values.get('captchaResponse'),
      origin: window.location.origin,
      referral: values.get('referral') || values.get('defaultRef'),
    });
  }

  render() {
    const { error, invalid, submitting, handleSubmit, asyncValidating } = this.props;
    const termsLink = (<a href="http://www.acebusters.com/terms_of_use.html" target="_blank"><FormattedMessage {...messages.terms} /></a>);
    return (
      <Container>
        <div>
          <H1>Register a new account!</H1>
          <Form
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Field name="email" type="text" component={FormField} label="e-mail" />
            <Field
              name="referral"
              type="text"
              component={FormField}
              label="referral code"
            />
            <Field name="captchaResponse" component={Captcha} />
            {error && <ErrorMessage error={error} />}
            <Field
              name="terms"
              type="checkbox"
              component={renderCheckBox}
              label={termsLink}
            />
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
    register: (payload) => dispatch(register(payload)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = (state, props) => ({
  initialValues: {
    referral: props.params.refCode,
  },
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'register',
    validate,
    warn,
  })(RegisterPage)
);
