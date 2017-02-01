import React, {Component} from 'react'
import {connect} from 'react-redux'
import { createStructuredSelector } from 'reselect';

import Form from '../../components/Form'
import FormPageWrapper from '../../components/Form/FormPageWrapper'
import makeSelectAccountData from '../AccountProvider/selectors';
import {loginRequest, changeForm } from '../AccountProvider/actions'

class LoginPage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let {dispatch} = this.props
    let {accountState, currentlySending, error} = this.props.data
    return (
      <FormPageWrapper>
        <div className='form-page__form-wrapper'>
          <div className='form-page__form-header'>
            <h2 className='form-page__form-heading'>Login</h2>
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
    )
  }

}

LoginPage.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func
}


function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (username, password) => dispatch(loginRequest({username, password})),
    onChangeForm: (newFormState) => dispatch(changeForm(newFormState)),
  };
}

// Which props do we want to inject, given the global state?
const mapStateToProps = createStructuredSelector({
  data: makeSelectAccountData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);