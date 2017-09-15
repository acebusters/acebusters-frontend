import React from 'react';
import PropTypes from 'prop-types';
import ethUtil from 'ethereumjs-util';
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
import { conf, ABI_PROXY } from '../../app.config';
import { promisifyWeb3Call } from '../../utils/promisifyWeb3Call';

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

  async createTx(wallet, receipt, confCode) {
    const { injectedAccount, networkSupported } = this.props;
    if (injectedAccount && networkSupported) {
      const web3 = getWeb3(true);
      const proxy = web3.eth.contract(ABI_PROXY);

      const getTransactionCount = promisifyWeb3Call(getWeb3(true).eth.getTransactionCount);
      const create = (...args) => new Promise((resolve, reject) => {
        const gas = 41154 + 489800; // estimated by remix
        proxy.new(...args, {
          from: injectedAccount,
          data: '0x6060604052341561000f57600080fd5b604051604080610a5a833981016040528080519060200190919080519060200190919050505b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50505b610991806100c96000396000f30060606040523615610076576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631a69523014610136578063893d20e81461016f578063a4e2d634146101c4578063c0ee0b8a146101f1578063d41bdea714610276578063d7f31eb9146102b7575b5b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614806100dd575067016345785d8a00003073ffffffffffffffffffffffffffffffffffffffff163111155b15156100e557fe5b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a25b005b341561014157600080fd5b61016d600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061033c565b005b341561017a57600080fd5b6101826103d7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101cf57600080fd5b6101d7610401565b604051808215151515815260200191505060405180910390f35b34156101fc57600080fd5b610274600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610445565b005b341561028157600080fd5b6102b5600480803560001916906020019091908035600019169060200190919080356000191690602001909190505061044b565b005b34156102c257600080fd5b61033a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061077d565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103d357806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b5b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141590505b90565b5b505050565b600080600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415151561049457fe5b602535925060303591506044359050306affffffffffffffffffffff16826affffffffffffffffffffff161415156104c857fe5b3373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415156104ff57fe5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561055857fe5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600160008484604051808460ff1660ff167f0100000000000000000000000000000000000000000000000000000000000000028152600101836affffffffffffffffffffff166affffffffffffffffffffff167501000000000000000000000000000000000000000000028152600b018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140193505050506040518091039020858989604051600081526020016040526000604051602001526040518085600019166000191681526020018460ff1660ff16815260200183600019166000191681526020018260001916600019168152602001945050505050602060405160208103908084039060008661646e5a03f115156106ca57600080fd5b50506020604051035173ffffffffffffffffffffffffffffffffffffffff161415156106f257fe5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561095f5760008373ffffffffffffffffffffffffffffffffffffffff161415610801578051602082016000f0925061095d565b8273ffffffffffffffffffffffffffffffffffffffff16828260405180828051906020019080838360005b838110156108485780820151818401525b60208101905061082c565b50505050905090810190601f1680156108755780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f192505050151561089657fe5b600082111561095c578273ffffffffffffffffffffffffffffffffffffffff167f180489ed98391c12b0b024acb7dcd85ce43619bcf0780aeca68aa3dd44651a5d83836040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156109205780820151818401525b602081019050610904565b50505050905090810190601f16801561094d5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a25b5b5b5b5b5050505600a165627a7a723058200c7a580c1774ba69ab2c81d8385cc4ae6955fe642fc4d27a41a63edb9a35f79e0029',
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

  async handleRecovery(wallet, receipt, confCode) {
    try {
      await accountService.resetWallet(confCode, wallet);
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
