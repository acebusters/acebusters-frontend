import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Form, Field, reduxForm, SubmissionError, propTypes } from 'redux-form/immutable';
import * as storageService from '../../services/localStorage';

import FormField from '../../components/Form/FormField';
import Button from '../../components/Button';
import Link from '../../components/Link';
import Container from '../../components/Container';
import { ErrorMessage } from '../../components/FormMessages';
import * as accountService from '../../services/account';
import { walletImport, login } from './actions';
import { setProgress } from '../App/actions';
import { setAuthState } from '../AccountProvider/actions';
import { notifyAdd } from '../Notifications/actions';
import { selectAccount } from '../AccountProvider/selectors';
import { getWeb3 } from '../AccountProvider/utils';
import { waitForTx } from '../../utils/waitForTx';
import H1 from '../../components/H1';
import { firstLogin } from '../Notifications/constants';

import { ForgotField } from './styles';

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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values, dispatch) {
    const maxAttemptCount = 3;
    const threshold = 1000 * 60 * 5;
    const now = Date.now();
    const lastLoginAttempt = parseInt(storageService.getItem('_l') || 0, 10);
    let counter = parseInt(storageService.getItem('_c') || 1, 10);

    storageService.setItem('_l', now);

    if (lastLoginAttempt) {
      if (now - lastLoginAttempt > threshold) {
        counter = 1;
      }

      storageService.setItem('_c', counter + 1);

      if (counter >= maxAttemptCount) {
        throw new SubmissionError({ _error: 'Too many requests from your IP address. Please try later' });
      }
    }

    return (
      accountService.login(values.get('email'))
        .catch((err) => {
          throw new SubmissionError({ _error: `Login failed with error code ${err.status}` });
        })
        // the best place for waiting for proxy tx, it allows to get login errors without delay
        .then((data) => {
          // if user just created account, we need to ensure that proxy contract is deployed before continue login process
          const proxyTxHash = this.props.account.get('proxyTxHash');
          if (proxyTxHash) {
            this.props.notifyAdd(firstLogin);
            return waitForTx(getWeb3(), proxyTxHash)
              .then(
                () => data,
                () => {
                  throw new SubmissionError({ _error: `Login failed. Account tx failed, tx has was: ${proxyTxHash}` });
                }
              );
          }

          return data;
        })
        .then((wallet) => {
          storageService.removeItem('_c');
          storageService.removeItem('_l');

          this.props.walletImport({
            json: wallet,
            password: values.get('password'),
          });
          // Login saga is called, we return the promise here,
          // so we can display form errors if any of the async ops fail.
          return (
            login(values, dispatch)
              .catch((workerErr) => {
                // If worker failed, ...
                if (workerErr.payload && workerErr.payload.error === 'invalid password') {
                  throw new SubmissionError({ email: 'The email or password is incorrect. Please try again.' });
                } else {
                  throw new SubmissionError({ _error: `Error: login failed due to worker error: ${workerErr}` });
                }
              })
              .then((workerRsp) => {
                // If worker success, ...
                // ...tell account provider about login.
                this.props.setAuthState({
                  privKey: workerRsp.payload.hexSeed,
                  email: values.get('email'),
                  loggedIn: true,
                });

                const { location } = this.props;
                let nextPath = '/lobby';

                if (location.state && location.state.nextPathname) {
                  nextPath = location.state.nextPathname;
                } else if (location.query && location.query.redirect) {
                  nextPath = decodeURIComponent(location.query.redirect);
                }

                browserHistory.push(nextPath); // Go to page that was requested
              })
          );
        })
    );
  }

  render() {
    const { error, handleSubmit, invalid, submitting } = this.props;
    return (
      <Container>
        <div>
          <H1>Log into your account!</H1>

          <Form onSubmit={handleSubmit(this.handleSubmit)}>
            <Field name="email" type="email" component={FormField} label="Email" autoFocus />
            <Field name="password" type="password" component={FormField} label="Password" />
            {error && <ErrorMessage error={error} />}
            <Button type="submit" size="large" disabled={submitting || invalid}>
              {(!submitting) ? 'Login' : 'Please wait ...'}
            </Button>
          </Form>

          <ForgotField>
            <Link to="reset">
              Forgot password
            </Link>
          </ForgotField>
        </div>
      </Container>
    );
  }
}

LoginPage.propTypes = {
  ...propTypes,
  location: React.PropTypes.any,
  setProgress: React.PropTypes.func,
  walletImport: React.PropTypes.func,
  setAuthState: React.PropTypes.func,
  notifyAdd: React.PropTypes.func,
};


function mapDispatchToProps(dispatch) {
  return {
    notifyAdd: (notification) => dispatch(notifyAdd(notification)),
    setProgress: (percent) => dispatch(setProgress(percent)),
    walletImport: (data) => dispatch(walletImport(data)),
    setAuthState: (data) => dispatch(setAuthState(data)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = (state) => ({
  account: selectAccount(state),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'login', validate, warn })(LoginPage)
);
