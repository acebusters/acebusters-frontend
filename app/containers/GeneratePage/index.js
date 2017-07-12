/* eslint no-multi-spaces: "off", key-spacing: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, SubmissionError, propTypes, change, formValueSelector } from 'redux-form/immutable';
import { browserHistory } from 'react-router';
import { Receipt, Type } from 'poker-helper';
import Pusher from 'pusher-js';

// components
import Container from '../../components/Container';
import FormField from '../../components/Form/FormField';
import Button from '../../components/Button';
import H1 from '../../components/H1';
import MouseEntropy from '../../components/MouseEntropy';
import { ErrorMessage } from '../../components/FormMessages';

import account from '../../services/account';
import * as storageService from '../../services/localStorage';
import { getWeb3 } from '../../containers/AccountProvider/utils';
import { waitForTx } from '../../utils/waitForTx';

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

function waitForAccountTx(signerAddr) {
  const pusher = new Pusher('d4832b88a2a81f296f53', { cluster: 'eu', encrypted: true });
  const channel = pusher.subscribe(signerAddr);
  return new Promise((resolve) => {
    channel.bind('update', (event) => {
      if (event.type === 'txHash') {
        resolve(waitForTx(getWeb3(), event.payload));
        channel.unbind('update');
      }
    });
  });
}

export class GeneratePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleWorkerMessage = this.handleWorkerMessage.bind(this);
    this.handleSaveEntropyClick = this.handleSaveEntropyClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateEntropy = this.updateEntropy.bind(this);
    this.state = {
      secretCreated: false,
      entropySaved: false, // not actually saved, just a UI device
    };
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

  handleSaveEntropyClick() {
    this.setState({ entropySaved: true });
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
      request(confCode, workerRsp.data.wallet)
        .catch((err) => {
          // If store account failed...
          if (err === 409) {
            throw new SubmissionError({ email: 'Email taken.', _error: 'Registration failed!' });
          } else {
            throw new SubmissionError({ _error: `Registration failed with error code ${err}` });
          }
        })
        .then(() => waitForAccountTx(workerRsp.data.wallet.address))
        .catch((err) => {
          throw new SubmissionError({ _error: `Registration failed with message: ${err}` });
        })
        .then(() => browserHistory.push('/login'))
    ));
  }

  updateEntropy(data) {
    this.setState({ secretCreated: true });
    this.props.onEntropyUpdated(JSON.stringify(data ? data.raw : null));
  }

  render() {
    const workerPath = this.props.workerPath + encodeURIComponent(location.origin);
    const { error, handleSubmit, submitting, entropy, invalid } = this.props;
    const { entropySaved, secretCreated } = this.state;
    return (
      <Container>

        {!entropySaved ?
          <div>
            <H1>Create Randomness for Secret</H1>
            <Form onSubmit={handleSubmit(this.handleSaveEntropyClick)}>
              <MouseEntropy totalBits={768} width="100%" height="200px" onFinish={this.updateEntropy} sampleRate={0} />
              <Field name="entropy" type="hidden" component={FormField} label="" value={entropy} />
              {error && <ErrorMessage error={error} />}
              <Button
                type="submit"
                disabled={!secretCreated || entropySaved}
                size="large"
              >
                { (!entropySaved) ? 'Save Entropy' : 'Entropy Saved' }
              </Button>
            </Form>
          </div>
          :
          <div>
            <H1>Encrypt & Save Your Account!</H1>
            <Form onSubmit={handleSubmit(this.handleSubmit)}>
              <Field name="password" type="password" component={FormField} label="Password" />
              <Field name="confirmedPassword" type="password" component={FormField} label="Confirm Password" />
              {error && <ErrorMessage error={error} />}
              <Button type="submit" disabled={submitting || invalid} size="large">
                { (!submitting) ? 'Encrypt and Save' : 'Please wait ...' }
              </Button>
            </Form>
          </div>
        }

        <iframe
          src={workerPath}
          title="iframe_generate"
          style={{ display: 'none' }}
          onLoad={(event) => {
            this.frame = event.target;
          }}
        />
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
  workerPath: PropTypes.string,
  onWorkerError:PropTypes.func,
  onWorkerInitialized: PropTypes.func,
  onWorkerProgress: PropTypes.func,
  onWalletExported: PropTypes.func,
  input: PropTypes.any,
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
