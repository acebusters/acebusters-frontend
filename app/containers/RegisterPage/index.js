import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import makeSelectAccountData from '../AccountProvider/selectors';
import { changeForm, workerError, workerLoaded, walletExported, workerProgress, exportRequest } from '../AccountProvider/actions';
import Form from '../../components/Form';
import accountService from '../../services/AccountService';

const FormPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export class RegisterPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.handleSerialize = this.handleSerialize.bind(this);
    this.onWorkerLoaded = this.onWorkerLoaded.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleSerialize, false);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleSerialize);
  }

  onWorkerLoaded(event) {
    // TODO: find another way to pass this to the saga
    window.frame = event.target;
    this.props.onWorkerLoaded();
  }

  handleSerialize(evt) {
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
      this.props.onWorkerLoaded();
    } else if (data.action === 'progress') {
      this.props.onWorkerProgress(parseInt(data.percent, 10));
    } else if (data.action === 'exported') {
      this.props.onWalletExported(data.json);
    } else {
      this.props.onWorkerError(evt);
    }
  }

  render() {
    const { formState, currentlySending, error } = this.props.account;
    const workerPath = this.props.workerPath + encodeURIComponent(location.origin);

    window.as = accountService;

    return (
      <FormPageWrapper>
        <div className="form-page__form-wrapper">
          <div className="form-page__form-header">
            <h2 className="form-page__form-heading">Register</h2>
          </div>
          <Form
            data={formState}
            history={this.props.history}
            onChangeForm={this.props.onChangeForm}
            onSubmitForm={this.props.onSubmitForm}
            btnText={'Register'}
            error={error}
            recaptchaKey={'6LcE0RQUAAAAAEf6UWFsHEPedPBmRPAQiaSiWynN'}
            currentlySending={currentlySending}
          />
        </div>
        <iframe src={workerPath} style={{ display: 'none' }} onLoad={this.onWorkerLoaded} />
      </FormPageWrapper>
    );
  }
}

RegisterPage.defaultProps = {
  workerPath: 'http://worker.acebusters.com.s3-website-us-east-1.amazonaws.com/iframe.html?origin=',
};

RegisterPage.propTypes = {
  account: React.PropTypes.object,
  history: React.PropTypes.object,
  workerPath: React.PropTypes.string,
  onSubmitForm: React.PropTypes.func,
  onChangeForm: React.PropTypes.func,
  onWorkerError: React.PropTypes.func,
  onWorkerLoaded: React.PropTypes.func,
  onWorkerProgress: React.PropTypes.func,
  onWalletExported: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (email, password) => dispatch(exportRequest({ email, password })),
    onChangeForm: (newFormState) => dispatch(changeForm(newFormState)),
    onWorkerError: (event) => dispatch(workerError(event)),
    onWorkerLoaded: () => dispatch(workerLoaded()),
    onWorkerProgress: (percent) => dispatch(workerProgress(percent)),
    onWalletExported: (wallet) => dispatch(walletExported(wallet)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = createStructuredSelector({
  account: makeSelectAccountData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
