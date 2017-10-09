import React from 'react';
import PropTypes from 'prop-types';
import ethUtil from 'ethereumjs-util';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, SubmissionError, propTypes, change, formValueSelector } from 'redux-form/immutable';
import { stopSubmit } from 'redux-form';
import { browserHistory } from 'react-router';
import { Receipt, Type } from 'poker-helper';

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
import { ABI_PROXY } from '../../app.config';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';

import { walletExport, register, accountTxHashReceived } from './actions';

const validate = (values) => {
  const errors = {};
  if (!values.get('password')) {
    errors.password = 'Required';
  } else if (values.get('password').length < 8) {
    errors.password = 'Must be 8 characters or more.';
  } else if (values.get('password').length >= 32) {
    errors.password = 'Must be less than 32 characters.';
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
      sharkSignup: (false && props.injectedAccount && props.networkSupported),
      entropySaved: false, // not actually saved, just a UI device
      ...this.loadReceipt(),
    };

    this.confirmation = this.confirm().catch(({ errors }) => {
      this.props.dispatch(stopSubmit('register', errors));
    });
  }

  componentDidMount() {
    const crypto = window.crypto || window.msCrypto;
    if (crypto.getRandomValues) {
      const raw = Array.from(crypto.getRandomValues(new Uint8Array(bitsToBytes(totalBits))));
      this.updateEntropy({ raw });
      this.handleSaveEntropyClick();
    }
  }

  async confirm() {
    const { confCode, receipt } = this.state;
    const storedConfCode = decodeURIComponent(storageService.getItem('ab-confCode') || '');

    if (storedConfCode === confCode) {
      return;
    }

    if (!receipt) {
      throw new SubmissionError({ _error: 'Wrong receipt' });
    }

    if (receipt.type === Type.CREATE_CONF) {
      try {
        await accountService.confirm(confCode);
      } catch (err) {
        if (err.status !== 409) {
          throw new SubmissionError({ _error: `Email Confirmation failed with error code ${err}` });
        }
      }
    } else if (receipt.type !== Type.RESET_CONF) {
      throw new SubmissionError({ _error: 'Unknown receipt type' });
    }

    storageService.setItem('ab-confCode', confCode);
  }

  loadReceipt() {
    const state = {
      confCode: decodeURIComponent(this.props.params.confCode || ''),
    };

    if (state.confCode) {
      try {
        state.receipt = Receipt.parse(state.confCode);
      } catch (e) { } // eslint-disable-line
    }

    return state;
  }

  handleSaveEntropyClick() {
    this.setState({ entropySaved: true });
  }

  async createTx(wallet, receipt, confCode) {
    const { injectedAccount } = this.props;
    if (this.state.sharkSignup) {
      const web3 = getWeb3(true);
      const proxy = web3.eth.contract(ABI_PROXY);

      const getTransactionCount = promisifyWeb3Call(getWeb3(true).eth.getTransactionCount);
      const create = (...args) => new Promise((resolve, reject) => {
        const gas = 41154 + 489800; // estimated by remix
        proxy.new(...args, {
          from: injectedAccount,
          data: '0x6060604052341561000f57600080fd5b5b5b60008054600160a060020a03191633600160a060020a03161790555b60008054600160a060020a03191633600160a060020a03161790555b5b6103ce806100596000396000f3006060604052361561005f5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663893d20e881146100a0578063c0ee0b8a146100cf578063d7f31eb914610136578063f2fde38b1461019d575b5b33600160a060020a03167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405190815260200160405180910390a25b005b34156100ab57600080fd5b6100b36101be565b604051600160a060020a03909116815260200160405180910390f35b34156100da57600080fd5b61009e60048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506101ce95505050505050565b005b341561014157600080fd5b61009e60048035600160a060020a03169060248035919060649060443590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506101d495505050505050565b005b34156101a857600080fd5b61009e600160a060020a0360043516610345565b005b600054600160a060020a03165b90565b5b505050565b60005433600160a060020a039081169116146101ef57600080fd5b600160a060020a038316151561020457600080fd5b82600160a060020a0316828260405180828051906020019080838360005b8381101561023b5780820151818401525b602001610222565b50505050905090810190601f1680156102685780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f192505050151561028957fe5b60008211156101ce5782600160a060020a03167f180489ed98391c12b0b024acb7dcd85ce43619bcf0780aeca68aa3dd44651a5d838360405182815260406020820181815290820183818151815260200191508051906020019080838360005b838110156103025780820151818401525b6020016102e9565b50505050905090810190601f16801561032f5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a25b5b5b505050565b60005433600160a060020a0390811691161461036057600080fd5b600160a060020a038116151561037557600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b505600a165627a7a723058207b75869999701f2afeb11246cb5c8b8a8b820eed3479e1b831949aff5dd2bc790029',
          gas,
        }, (err, result) => {
          if (err) { reject(err); } else { resolve(result); }
        });
      });

      const txCount = await getTransactionCount(injectedAccount);
      const proxyAddr = ethUtil.bufferToHex(ethUtil.generateAddress(injectedAccount, txCount));
      const { transactionHash } = await create(wallet.address, 0);

      await accountService.addWallet(
        confCode,
        wallet,
        proxyAddr
      );

      return transactionHash;
    }

    return accountService.addWallet(confCode, wallet).then(() => undefined);
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
        }
        browserHistory.push('/login');
      });
  }

  async handleRecovery(wallet, receipt, confCode) {
    try {
      await accountService.resetWallet(confCode, wallet);
      browserHistory.push('/login');
    } catch (e) {
      throwSubmitError(e);
    }
  }

  async handleSubmit(values, dispatch) {
    const { confCode, receipt } = this.state;

    if (!confCode) {
      throw new SubmissionError({ _error: 'Session receipt is lost' });
    }

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
      this.confirmation
        .then(() => register(values, dispatch))
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
    const { entropySaved, secretCreated, receipt } = this.state;
    return (
      <Container>
        {!entropySaved &&
          <div>
            <H1>Create Randomness for Secret</H1>
            <Form onSubmit={handleSubmit(this.handleSaveEntropyClick)}>
              <MouseEntropy totalBits={totalBits} width="100%" height="200px" onFinish={this.updateEntropy} sampleRate={0} />
              <Field name="entropy" type="hidden" component={FormField} label="" value={entropy} />
              {error && <ErrorMessage error={error.message} />}
              <Button
                type="submit"
                disabled={!secretCreated || entropySaved}
                size="large"
              >
                { (!entropySaved) ? 'Save Entropy' : 'Entropy Saved' }
              </Button>
            </Form>
          </div>
        }
        {entropySaved &&
          <div>
            <H1>Encrypt & Save Your Account!</H1>
            <Form
              onSubmit={handleSubmit(this.handleSubmit)}
              ref={(form) => { this.form = form; }}
            >
              <Field name="password" type="password" component={FormField} label="Password" />
              <Field name="confirmedPassword" type="password" component={FormField} label="Confirm Password" />
              {error && <ErrorMessage error={error.message} />}

              <Button type="submit" disabled={submitting || (invalid && (!error || !error.valid))} size="large">
                {!submitting ? 'Encrypt and Save' : 'Please wait ...'}
              </Button>
            </Form>
          </div>
        }

        {submitting &&
          <div>
            <H1>
              {receipt.type === Type.CREATE_CONF
                ? 'Registering please wait...'
                : 'Recovering your account...'}
            </H1>
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
    throw new SubmissionError({ email: 'Email taken.', _error: { message: 'Registration failed!' } });
  } else if (err.message && err.message === 'Failed to fetch') {
    throw new SubmissionError({ _error: { message: 'Registration failed due to interrupted connection, please try again', valid: true } });
  } else {
    throw new SubmissionError({ _error: { message: `Registration failed with error code ${err}` } });
  }
};

function mapDispatchToProps(dispatch) {
  return {
    walletExport: (...args) => dispatch(walletExport(...args)),
    onAccountTxHashReceived: (...args) => dispatch(accountTxHashReceived(...args)),
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
