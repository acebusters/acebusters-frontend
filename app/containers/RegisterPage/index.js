/*
 *
 * RegisterPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import messages from './messages';
import makeSelectAccountData from '../AccountProvider/selectors';
import {registerRequest, changeForm } from '../AccountProvider/actions'
import FormPageWrapper from '../../components/Form/FormPageWrapper'
import Form from '../../components/Form'


export class RegisterPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    let {accountState, currentlySending, error} = this.props.data

    return (
      <FormPageWrapper>
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Register</h2>
          </div>
          <Form data={accountState} history={this.props.history} onChangeForm={this.props.onChangeForm} onSubmitForm={this.props.onSubmitForm} btnText={'Register'} error={error} currentlySending={currentlySending} />
        </div>
      </FormPageWrapper>
    );
  }
}

RegisterPage.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (username, password) => dispatch(registerRequest({username, password})),
    onChangeForm: (newFormState) => dispatch(changeForm(newFormState)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = createStructuredSelector({
  data: makeSelectAccountData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);