/* eslint no-multi-spaces: "off", key-spacing: "off" */

import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, SubmissionError, propTypes, change, formValueSelector } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import { Receipt, Type } from 'poker-helper';
// components
import Container from '../../components/Container';
import Label from '../../components/Label';
import FormField from '../../components/Form/FormField';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import MouseEntropy from '../../components/MouseEntropy';
import { ErrorMessage } from '../../components/FormMessages';

import account from '../../services/account';
import * as storageService from '../../services/localStorage';
import { workerError, walletExported, register } from './actions';

const validate = (values) => {
  const errors = {};
  if (!values.get('password')) {
    errors.password = 'Required';
  } else if (values.get('password').length < 8) {
    errors.password = 'Must be 8 characters or more.';
  }
  if (values.get('password') !== values.get('confirmedPassword')) {
    errors.confirmedPassword = 'Passwords dont match';
  }
  if (!values.get('entropy') || !values.get('entropy').length) {
    errors.entropy = 'Required';
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

export class GeneratePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
      throw new SubmissionError({ _error: evt });
    }
  }

  handleSubmit(values, dispatch) {
    if (!this.props.isWorkerInitialized) {
      // The worker should have been loaded, while user typed.
      // If not, we can not start wallet encryption ... error.
      throw new SubmissionError({ _error: 'Error: encryption worker not loaded.' });
    }
    let confCode = storageService.getItem('ab-confCode');
    if (!confCode) {
      throw new SubmissionError({ _error: 'Error: session token lost.' });
    }
    confCode = decodeURIComponent(confCode);
    const receipt = Receipt.parse(confCode);
    let request;
    if (receipt.type === Type.CREATE_CONF) {
      request = account.addWallet;
    } else if (receipt.type === Type.RESET_CONF) {
      request = account.resetWallet;
    } else {
      throw new SubmissionError({ _error: `Error: unknown session type ${receipt.type}.` });
    }

    const entropy = JSON.parse(values.get('entropy'));
    const seed    = Buffer.from(entropy.slice(0, 32));
    const secret  = Buffer.from(entropy.slice(32));

    // Strating the worker here.
    // Worker will encrypt seed with password in many rounds of crypt.
    this.frame.contentWindow.postMessage({
      action: 'export',
      hexSeed: seed.toString('hex'),
      password: values.get('password'),
      randomBytes: secret,
    }, '*');
    // Register saga is called, we return the promise here,
    // so we can display form errors if any of the async ops fail.
    return register(values, dispatch).catch((workerErr) => {
      // If worker failed, ...
      throw new SubmissionError({ _error: `error, Registration failed due to worker error: ${workerErr}` });
    }).then((workerRsp) => (
      // If worker success, ...
      request(confCode, workerRsp.data.wallet).catch((err) => {
        // If store account failed, ...
        const errMsg = 'Registration failed!';
        if (err === 409) {
          throw new SubmissionError({ email: 'Email taken.', _error: errMsg });
        } else {
          throw new SubmissionError({ _error: `Registration failed with error code ${err}` });
        }
      }).then(() => {
        // If store account success, ...
        browserHistory.push('/login');
      })
    ));
  }

  render() {
    const workerPath = this.props.workerPath + encodeURIComponent(location.origin);
    const { error, handleSubmit, submitting, entropy } = this.props;
    const updateEntropy = (data) => {
      this.props.onEntropyUpdated(JSON.stringify(data ? data.raw : null));
    };

    return (
      <Container>
        <div>
          <H1>Encrypt & Store new account!</H1>
          <Form
            onSubmit={handleSubmit(this.handleSubmit)}
          >
            <Label style={{ float: 'none' }}>Random Secret</Label>
            <MouseEntropy totalBits={768} width="100%" height="200px" onFinish={updateEntropy} sampleRate={0} />
            <Field name="entropy" type="hidden" component={FormField} label="" value={entropy} />
            <Field name="password" type="password" component={FormField} label="password" />
            <Field name="confirmedPassword" type="password" component={FormField} label="confirm password" />
            {error && <ErrorMessage error={error} />}
            <Button type="submit" disabled={submitting} size="large">
              { (!submitting) ? 'Encrypt and Store' : 'Please wait ...' }
            </Button>
          </Form>
          <iframe
            src={workerPath} style={{ display: 'none' }} onLoad={(event) => {
              this.frame = event.target;
            }}
          />
        </div>
        { this.props.progress && submitting &&
          <div>
            <H1>Registering please wait ...</H1>
          </div>
        }
      </Container>
    );
  }
}

GeneratePage.defaultProps = {
  workerPath: 'http://worker.acebusters.com.s3-website-us-east-1.amazonaws.com/iframe.html?origin=',
};

GeneratePage.propTypes = {
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
    onEntropyUpdated: (data) => dispatch(change('register', 'entropy', data)),
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
  entropy: selector(state, 'entropy'),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'register', validate, warn })(GeneratePage));
