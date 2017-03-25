import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Field, reduxForm, SubmissionError, propTypes, change, formValueSelector } from 'redux-form/immutable';
import crypto from 'crypto';
import { browserHistory } from 'react-router';
// components
import Container from '../../components/Container';
import FormGroup from '../../components/Form/FormGroup';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import ErrorMessage from '../../components/ErrorMessage';
import Radial from '../../components/RadialProgress';

import account from '../../services/account';
import { workerError, walletExported, register } from './actions';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = (values) => {
  const errors = {};
  if (!values.get('email')) {
    errors.email = 'Required';
  } else if (!emailRegex.test(values.get('email'))) {
    errors.email = 'Invalid email address.';
  }
  if (!values.get('password')) {
    errors.password = 'Required';
  } else if (values.get('password').length < 8) {
    errors.password = 'Must be 8 characters or more.';
  }
  if (values.get('password') !== values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Passwords dont match';
  }
  if (!values.get('captchaResponse')) {
    errors.captchaResponse = 'Required';
  }
  return errors;
};

const warn = (values) => {
  const warnings = {};
  const pw = values.get('password');
  if (pw && pw.length < 12) {
    warnings.password = 'Better to use a strong passwords.';
  }
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
    {touched && ((error && <ErrorMessage error={error}></ErrorMessage>) || (warning && <ErrorMessage error={warning}></ErrorMessage>))}
  </FormGroup>
);
/* eslint-enable react/prop-types */

export class RegisterPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.handleWorkerMessage = this.handleWorkerMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleWorkerMessage, false);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleWorkerMessage);
  }

  handleWorkerMessage(evt) {
    const pathArray = this.props.workerPath.split('/');
    const origin = `${pathArray[0]}//${pathArray[2]}`;
    if (evt.origin !== origin) {
      // this event came from some other iframe;
      return;
    }
    if (!evt.data || evt.data.action === 'error') {
      this.props.onWorkerError(evt);
      return;
    }
    const data = evt.data;
    if (data.action === 'loaded') {
      // the worker js is talking.
      this.props.onWorkerInitialized();
    } else if (data.action === 'progress') {
      this.props.onWorkerProgress(parseInt(data.percent, 10));
    } else if (data.action === 'exported') {
      this.props.onWalletExported({ wallet: data.json });
    } else {
      this.props.onWorkerError(evt);
    }
  }

  handleSubmit(values, dispatch) {
    if (!this.props.isWorkerInitialized) {
      // The worker should have been loaded, while user typed.
      // If not, we can not start wallet encryption ... error.
      throw new SubmissionError({ _error: 'Error: encryption worker not loaded.' });
    }
    // TODO(ace): create a separate screen to collect real entropy.
    const seed = crypto.randomBytes(32);
    // Strating the worker here.
    // Worker will encrypt seed with password in many rounds of crypt.
    this.frame.contentWindow.postMessage({
      action: 'export',
      hexSeed: seed.toString('hex'),
      password: values.get('password'),
      randomBytes: crypto.randomBytes(64),
    }, '*');
    // Register saga is called, we return the promise here,
    // so we can display form errors if any of the async ops fail.
    return register(values, dispatch).catch((workerErr) => {
      // If worker failed, ...
      throw new SubmissionError({ _error: `error, Registration failed due to worker error: ${workerErr}` });
    }).then((workerRsp) => (
      // If worker success, ...
      account.register(values.get('email'), workerRsp.data.wallet, values.get('captchaResponse'), window.location.origin).catch((err) => {
        // If store account failed, ...
        const errMsg = 'Login failed!';
        if (err === 409) {
          throw new SubmissionError({ email: 'Email taken.', _error: errMsg });
        } else {
          throw new SubmissionError({ _error: `Registration failed with error code ${err}` });
        }
      }).then(() => {
        // If store account success, ...
        browserHistory.push('/confirm');
      })
    ));
  }

  render() {
    const workerPath = this.props.workerPath + encodeURIComponent(location.origin);
    const { error, handleSubmit, submitting } = this.props;

    return (
      <Container>
        <div>
          <H1> Register a new account!</H1>
          <Form
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Field name="email" type="text" component={renderField} label="e-mail" />
            <Field name="password" type="password" component={renderField} label="password" />
            <Field name="confirmedPassword" type="password" component={renderField} label="confirm   password" />
            <Field name="captchaResponse" component={Captcha} />
            {error && <ErrorMessage error={error}></ErrorMessage>}
            <Button type="submit" disabled={submitting} size="large">Register</Button>
          </Form>
          <iframe
            src={workerPath} style={{ display: 'none' }} onLoad={(event) => {
              this.frame = event.target;
            }}
          />
        </div>
        { this.props.progress &&
          <div>
            <Radial progress={this.props.progress}></Radial>
            <H1>Registering please wait ...</H1>
          </div>
        }
      </Container>
    );
  }
}

RegisterPage.defaultProps = {
  workerPath: 'http://worker.acebusters.com.s3-website-us-east-1.amazonaws.com/iframe.html?origin=',
};

RegisterPage.propTypes = {
  ...propTypes,
  workerPath: React.PropTypes.string,
  onWorkerError: React.PropTypes.func,
  onWorkerInitialized: React.PropTypes.func,
  onWorkerProgress: React.PropTypes.func,
  onWalletExported: React.PropTypes.func,
  input: React.PropTypes.any,
};

function mapDispatchToProps(dispatch) {
  return {
    onWorkerError: (event) => dispatch(workerError(event)),
    onWorkerInitialized: () => dispatch(change('register', 'isWorkerInitialized', true)),
    onWorkerProgress: (percent) => dispatch(change('register', 'workerProgress', percent)),
    onWalletExported: (data) => dispatch(walletExported(data)),
  };
}

// Which props do we want to inject, given the global state?
const selector = formValueSelector('register');
const mapStateToProps = (state) => ({
  initialValues: {
    isWorkerInitialized: false,
  },
  progress: selector(state, 'workerProgress'),
  isWorkerInitialized: selector(state, 'isWorkerInitialized'),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'register', validate, warn })(RegisterPage));
