import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Form, Field, reduxForm, SubmissionError, propTypes, change, formValueSelector } from 'redux-form/immutable';
import FormField from '../../components/Form/FormField';
import Button from '../../components/Button';
import Container from '../../components/Container';
import { ErrorMessage } from '../../components/FormMessages';
import account from '../../services/account';
import { workerError, walletImported, login } from './actions';
import { modalAdd, modalDismiss, setProgress } from '../App/actions';
import { setAuthState } from '../AccountProvider/actions';
import H1 from '../../components/H1';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = (values) => {
  const errors = {};
  if (!values.get('password')) {
    errors.password = 'Required';
  } else if (values.get('password').length < 8) {
    errors.password = 'Must be 8 characters or more.';
  }

  if (!values.get('email')) {
    errors.email = 'Required';
  } else if (!emailRegex.test(values.get('email'))) {
    errors.email = 'Invalid email address.';
  }
  return errors;
};

const warn = () => {
  const warnings = {};
  return warnings;
};

export class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleWorkerMessage = this.handleWorkerMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      waiting: false,
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.handleWorkerMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWorkerMessage);
  }

  handleSubmit(values, dispatch) {
    return account.login(values.get('email')).catch((err) => {
      const errMsg = 'Login failed!';
      if (err === 404) {
        throw new SubmissionError({ confCode: 'Email unknown.', _error: errMsg });
      } else {
        throw new SubmissionError({ _error: `Login failed with error code ${err}` });
      }
    }).then((data) => {
      if (!this.props.isWorkerInitialized) {
        throw new SubmissionError({ _error: 'Error: decryption worker not loaded.' });
      }
      this.frame.contentWindow.postMessage({
        action: 'import',
        json: data.wallet,
        password: values.get('password'),
      }, '*');
      // Login saga is called, we return the promise here,
      // so we can display form errors if any of the async ops fail.
      return login(values, dispatch).catch((workerErr) => {
        // If worker failed, ...
        throw new SubmissionError({ _error: `error, Login failed due to worker error: ${workerErr}` });
      }).then((workerRsp) => {
        // If worker success, ...
        // ...tell account provider about login.
        dispatch(setAuthState({
          privKey: workerRsp.data.privKey,
          email: values.get('email'),
          loggedIn: true,
        }));

        const { location } = this.props;
        let nextPath = '/lobby';

        if (location.state && location.state.nextPathname) {
          nextPath = location.state.nextPathname;
        } else if (location.query && location.query.redirect) {
          nextPath = decodeURIComponent(location.query.redirect);
        }

        browserHistory.push(nextPath); // Go to page that was requested
      });
    });
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
      // the worker js is talking
      this.props.onWorkerInitialized();
    } else if (data.action === 'progress') {
      this.props.setProgress(parseInt(data.percent, 10));
    } else if (data.action === 'imported') {
      if (data.hexSeed === null) {
        this.props.onWorkerError('Message Authentication Code mismatch (wrong password)');
      } else {
        this.props.onWalletImported({ privKey: data.hexSeed });
      }
    } else {
      this.props.onWorkerError(evt);
    }
  }

  render() {
    const workerPath = this.props.workerPath + encodeURIComponent(location.origin);
    const { error, handleSubmit, invalid, submitting } = this.props;

    return (<Container>
      <div>
        <H1>Log into your account!</H1>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="email" type="text" component={FormField} label="Email" />
          <Field name="password" type="password" component={FormField} label="Password" />
          {error && <ErrorMessage error={error} />}
          <Button type="submit" size="large" disabled={submitting || invalid}>
            { (!submitting) ? 'Login' : 'Please wait ...' }
          </Button>
        </Form>
        <iframe src={workerPath} style={{ display: 'none' }} onLoad={(event) => { this.frame = event.target; }} />
        <a href={'reset'}>forgot password</a>
      </div>
    </Container>);
  }
}

LoginPage.defaultProps = {
  workerPath: 'http://worker.acebusters.com.s3-website-us-east-1.amazonaws.com/iframe.html?origin=',
};

LoginPage.propTypes = {
  ...propTypes,
  workerPath: React.PropTypes.string,
  onWorkerError: React.PropTypes.func,
  onWorkerInitialized: React.PropTypes.func,
  onWalletImported: React.PropTypes.func,
  location: React.PropTypes.any,
  isWorkerInitialized: React.PropTypes.bool,
  progress: React.PropTypes.any,
  modalAdd: React.PropTypes.func,
  setProgress: React.PropTypes.func,
  modalStack: React.PropTypes.array,
};


function mapDispatchToProps(dispatch) {
  return {
    onWorkerError: (event) => dispatch(workerError(event)),
    onWorkerInitialized: () => dispatch(change('login', 'isWorkerInitialized', true)),
    onWalletImported: (data) => dispatch(walletImported(data)),
    modalAdd: (node) => dispatch(modalAdd(node)),
    modalDismiss: () => dispatch(modalDismiss()),
    setProgress: (percent) => dispatch(setProgress(percent)),
  };
}

// Which props do we want to inject, given the global state?
const selector = formValueSelector('login');
const mapStateToProps = (state) => ({
  initialValues: {
    isWorkerInitialized: false,
  },
  isWorkerInitialized: selector(state, 'isWorkerInitialized'),
});


// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'login', validate, warn })(LoginPage));
