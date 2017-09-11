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

import * as accountService from '../../services/account';
import * as storageService from '../../services/localStorage';
import { makeSelectInjected, makeSelectNetworkSupported } from '../../containers/AccountProvider/selectors';
import { getWeb3 } from '../../containers/AccountProvider/utils';
import { waitForTx } from '../../utils/waitForTx';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';
import { conf, ABI_ACCOUNT_FACTORY, ABI_PROXY } from '../../app.config';
import { sendTx } from '../../services/transactions';

import { walletExport, register, accountTxHashReceived } from './actions';

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

function waitForAccountTxHash(signerAddr) {
  const pusher = new Pusher(conf().pusherApiKey, { cluster: 'eu', encrypted: true });
  const channel = pusher.subscribe(signerAddr);
  return new Promise((resolve) => {
    channel.bind('update', (event) => {
      if (event.type === 'txHash') {
        resolve(event.payload);
        channel.unbind('update');
      }
    });
  });
}

const totalBits = 768;
const bitsToBytes = (bits) => bits / 8;

export class GeneratePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleSaveEntropyClick = this.handleSaveEntropyClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateEntropy = this.updateEntropy.bind(this);
    this.state = {
      secretCreated: false,
      entropySaved: false, // not actually saved, just a UI device
    };
  }

  componentDidMount() {
    const crypto = window.crypto || window.msCrypto;
    if (crypto.getRandomValues) {
      const raw = Array.from(crypto.getRandomValues(new Uint8Array(bitsToBytes(totalBits))));
      this.updateEntropy({ raw });
      this.handleSaveEntropyClick();
    }
  }

  handleSaveEntropyClick() {
    this.setState({ entropySaved: true });
  }

  createTx(wallet, receipt, confCode) {
    const { injectedAccount, networkSupported } = this.props;
    if (injectedAccount && networkSupported) {
      const web3 = getWeb3(true);
      const factory = web3.eth.contract(ABI_ACCOUNT_FACTORY).at(conf().accountFactory);
      const create = promisifyWeb3Call(factory.create.sendTransaction);
      return (
        create(wallet.address, 0, { from: injectedAccount })
          .then((txHash) => accountService.addWallet(confCode, wallet, txHash).then(() => txHash))
      );
    }

    return Promise.all([
      waitForAccountTxHash(wallet.address),
      accountService.addWallet(confCode, wallet),
    ]).then(([txHash]) => txHash);
  }

  handleCreate(wallet, receipt, confCode) {
    return this.createTx(wallet, receipt, confCode)
      .catch((err) => {
        if (err.message.indexOf('Error: MetaMask Tx Signature') === -1) {
          throwSubmitError(err);
        }
        return Promise.resolve();
      })
      .then((txHash) => {
        if (txHash) {
          this.props.onAccountTxHashReceived(txHash);
          browserHistory.push('/login');
        }
      });
  }

  async recoveryTx(wallet, receipt, confCode, privKey) {
    const factory = getWeb3().eth.contract(ABI_ACCOUNT_FACTORY).at(conf().accountFactory);
    const newSignerAddr = wallet.address;
    const acc = await promisifyWeb3Call(factory.getAccount)(receipt.oldSignerAddr);
    const proxyAddr = acc[0];
    const isLocked = acc[2];
    const data = factory.handleRecovery.getData(newSignerAddr);

    if (isLocked) {
      const forwardReceipt = new Receipt(proxyAddr).forward(0, factory.address, 0, data).sign(privKey);
      const [txHash] = await Promise.all([
        waitForAccountTxHash(receipt.oldSignerAddr),
        await sendTx(forwardReceipt, confCode),
      ]);

      return txHash;
    }

    const proxy = getWeb3(true).eth.contract(ABI_PROXY).at(proxyAddr);
    return promisifyWeb3Call(proxy.forward.sendTransaction)(
      factory.address,
      0,
      data,
      { from: window.web3.eth.accounts[0] }
    );
  }

  async handleRecovery(wallet, receipt, confCode, privKey) {
    try {
      const txHash = await this.recoveryTx(wallet, receipt, confCode, privKey);
      await accountService.resetWallet(confCode, wallet);
      await waitForTx(getWeb3(), txHash);

      browserHistory.push('/login');
    } catch (e) {
      throwSubmitError(e);
    }
  }

  handleSubmit(values, dispatch) {
    let confCode = storageService.getItem('ab-confCode');
    if (!confCode) {
      throw new SubmissionError({ _error: 'Error: session token lost.' });
    }
    confCode = decodeURIComponent(confCode);
    const receipt = Receipt.parse(confCode);
    if (receipt.type !== Type.CREATE_CONF && receipt.type !== Type.RESET_CONF) {
      throw new SubmissionError({ _error: `Error: unknown session type ${receipt.type}.` });
    }

    const entropy = JSON.parse(values.get('entropy'));
    // Strating the worker here.
    // Worker will encrypt seed with password in many rounds of crypt.
    this.props.walletExport({
      entropy,
      password: values.get('password'),
    });

    // Register saga is called, we return the promise here,
    // so we can display form errors if any of the async ops fail.
    return (
      register(values, dispatch)
        .catch(throwWorkerError)
        // If worker success, ...
        .then((workerRsp) => {
          const wallet = JSON.parse(workerRsp.payload.json);
          wallet.address = `0x${wallet.address}`;
          delete wallet.id;
          return receipt.type === Type.RESET_CONF
            ? this.handleRecovery(wallet, receipt, confCode, workerRsp.payload.privateKey)
            : this.handleCreate(wallet, receipt, confCode);
        })
    );
  }

  updateEntropy(data) {
    this.setState({ secretCreated: true });
    this.props.onEntropyUpdated(JSON.stringify(data ? data.raw : null));
  }

  render() {
    const { error, handleSubmit, submitting, entropy, invalid } = this.props;
    const { entropySaved, secretCreated } = this.state;
    return (
      <Container>
        {!entropySaved ?
          <div>
            <H1>Create Randomness for Secret</H1>
            <Form onSubmit={handleSubmit(this.handleSaveEntropyClick)}>
              <MouseEntropy totalBits={totalBits} width="100%" height="200px" onFinish={this.updateEntropy} sampleRate={0} />
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

        { submitting &&
          <div>
            <H1>Registering please wait ...</H1>
          </div>
        }
      </Container>
    );
  }
}

GeneratePage.propTypes = {
  ...propTypes,
  walletExport: PropTypes.func,
  onAccountTxHashReceived: PropTypes.func,
  input: PropTypes.any,
};

const throwWorkerError = (workerErr) => {
  throw new SubmissionError({ _error: `error, Registration failed due to worker error: ${workerErr.payload.error}` });
};

const throwSubmitError = (err) => {
  // If store account failed...
  if (err.status && err.status === 409) {
    throw new SubmissionError({ email: 'Email taken.', _error: 'Registration failed!' });
  } else {
    throw new SubmissionError({ _error: `Registration failed with error code ${err}` });
  }
};

function mapDispatchToProps(dispatch) {
  return {
    walletExport: (data) => dispatch(walletExport(data)),
    onAccountTxHashReceived: (txHash) => dispatch(accountTxHashReceived(txHash)),
    onEntropyUpdated: (data) => dispatch(change('register', 'entropy', data)),
  };
}

// Which props do we want to inject, given the global state?
const selector = formValueSelector('register');
const mapStateToProps = (state) => ({
  entropy: selector(state, 'entropy'),
  injectedAccount: makeSelectInjected()(state),
  networkSupported: makeSelectNetworkSupported()(state),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'register', validate, warn })(GeneratePage));
