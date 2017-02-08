import React from 'react';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';

import ErrorMessage from '../../components/ErrorMessage';
import LoadingButton from '../../components/LoadingButton';


const FormFieldInput = styled.input`
  position: relative;
  padding: 1.625em 16px;
  width: 100%;
  color: $dark-grey;
  border: none;
  outline: 0;
  letter-spacing: 0.05em;

  &:focus {
    background-color: $very-light-grey;
    color: $very-dark-grey;
  }
`;

const FormFieldLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  padding-top: 20px;
  padding-bottom: 0;
  margin: 0;
  z-index: 1;
  font-size: .8em;
  color: $mid-grey;
  font-weight: 400;
  user-select: none;
  cursor: text;
`;

const FormFieldWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-top: 1.75em;
  border-top: 1px solid $very-light-grey;
  border-bottom: 1px solid $very-light-grey;
  background-color: #fff;
`;

const FormSubmitButton = styled.button`
  padding: 2em 1em;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
`;

const FormSubmitButtonWrapper = styled.div`
  padding: 2em 1em;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
`;

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmitForm(this.props.data.username, this.props.data.password);
  }

  emitChange(newFormState) {
    this.props.onChangeForm(newFormState);
  }

  changePassword(event) {
    this.emitChange({ ...this.props.data, password: event.target.value });
  }

  changeUsername(event) {
    this.emitChange({ ...this.props.data, username: event.target.value });
  }

  render() {
    const { error } = this.props;
    return (
      <form className="form" onSubmit={this.onSubmit}>
        {error && <ErrorMessage error={error} />}
        <FormFieldWrapper>
          <FormFieldInput
            type="text"
            id="username"
            value={this.props.data.username}
            placeholder="addr@email.org"
            onChange={this.changeUsername}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <FormFieldLabel htmlFor="username">
            Username
          </FormFieldLabel>
        </FormFieldWrapper>
        <FormFieldWrapper>
          <FormFieldInput
            id="password"
            type="password"
            value={this.props.data.password}
            placeholder="••••••••••"
            onChange={this.changePassword}
          />
          <FormFieldLabel htmlFor="password">
            Password
          </FormFieldLabel>
        </FormFieldWrapper>
        {(this.props.progress) ? <div> progress: {this.props.progress} % </div> : <div> progress: 0 % </div>}
        {this.props.recaptchaKey && <ReCAPTCHA sitekey={this.props.recaptchaKey} onChange={this.props.onRecaptchaResponse} />}
        <FormSubmitButtonWrapper>
          {this.props.currentlySending ? (
            <LoadingButton />
          ) : (
            <FormSubmitButton type="submit">
              {this.props.btnText}
            </FormSubmitButton>
             )}
        </FormSubmitButtonWrapper>
      </form>
    );
  }
}

Form.propTypes = {
  data: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func,
  onChangeForm: React.PropTypes.func,
  onRecaptchaResponse: React.PropTypes.func,
  btnText: React.PropTypes.string,
  error: React.PropTypes.string,
  recaptchaKey: React.PropTypes.string,
  progress: React.PropTypes.number,
  currentlySending: React.PropTypes.bool,
};

export default Form;
