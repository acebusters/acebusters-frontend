import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import Form from '../../components/Form';
import makeSelectAccountData from '../AccountProvider/selectors';
import { loginRequest, changeForm } from '../AccountProvider/actions';

const FormPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export class LoginPage extends Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { accountState, currentlySending, error } = this.props.data;
    return (
      <FormPageWrapper>
        <div className="form-page__form-wrapper">
          <div className="form-page__form-header">
            <h2 className="form-page__form-heading">Login</h2>
          </div>
          <Form
            data={accountState}
            history={this.props.history}
            onChangeForm={this.props.onChangeForm}
            onSubmitForm={this.props.onSubmitForm}
            btnText={'Login'}
            error={error}
            currentlySending={currentlySending}
          />
        </div>
      </FormPageWrapper>
    );
  }
}

LoginPage.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func,
  onChangeForm: React.PropTypes.func,
};


function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (username, password) => dispatch(loginRequest({ username, password })),
    onChangeForm: (newFormState) => dispatch(changeForm(newFormState)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = createStructuredSelector({
  data: makeSelectAccountData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
