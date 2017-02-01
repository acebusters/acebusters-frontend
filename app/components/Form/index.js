import React, {Component} from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingButton from '../../components/LoadingButton'
import FormFieldLabel from './FormFieldLabel'
import FormFieldWrapper from './FormFieldWrapper'
import FormFieldInput from './FormFieldInput'
import FormSubmitButtonWrapper from './FormSubmitButtonWrapper'
import FormSubmitButton from './FormSubmitButton'

class Form extends Component {
  constructor (props) {
    super(props)

    this._onSubmit = this._onSubmit.bind(this)
    this._changeUsername = this._changeUsername.bind(this)
    this._changePassword = this._changePassword.bind(this)
  }
  render () {
    let {error} = this.props
    return (
      <form className='form' onSubmit={this._onSubmit}>
        {error ? <ErrorMessage error={error} /> : null}
        <FormFieldWrapper>
          <FormFieldInput
            type='text'
            id='username'
            value={this.props.data.username}
            placeholder='frank.underwood'
            onChange={this._changeUsername}
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false' />
          <FormFieldLabel htmlFor='username'>
            Username
          </FormFieldLabel>
        </FormFieldWrapper>
        <FormFieldWrapper>
          <FormFieldInput
            id='password'
            type='password'
            value={this.props.data.password}
            placeholder='••••••••••'
            onChange={this._changePassword} />
          <FormFieldLabel htmlFor='password'>
            Password
          </FormFieldLabel>
        </FormFieldWrapper>
        <FormSubmitButtonWrapper>
          {this.props.currentlySending ? (
            <LoadingButton />
          ) : (
            <FormSubmitButton type='submit'>
              {this.props.btnText}
            </FormSubmitButton>
             )}
        </FormSubmitButtonWrapper>
      </form>
    )
  }

  _changeUsername (event) {
    this._emitChange({...this.props.data, username: event.target.value})
  }

  _changePassword (event) {
    this._emitChange({...this.props.data, password: event.target.value})
  }

  _emitChange (newFormState) {
    this.props.onChangeForm(newFormState)
  }

  _onSubmit (event) {
    event.preventDefault()
    this.props.onSubmitForm(this.props.data.username, this.props.data.password)
  }
}

Form.propTypes = {
  data: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func,
  onChangeForm: React.PropTypes.func,
  btnText: React.PropTypes.string,
  error: React.PropTypes.string,
  currentlySending: React.PropTypes.bool
}

export default Form