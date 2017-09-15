import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { conf } from '../../app.config';

export default class Captcha extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      this.recaptcha.reset();
      if (typeof nextProps.input.onChange === 'function') {
        nextProps.input.onChange(false);
      }
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '15px' }}>
        <ReCAPTCHA
          ref={(recaptcha) => { this.recaptcha = recaptcha; }}
          sitekey={conf().recaptchaKey}
          onChange={this.props.input.onChange}
        />
      </div>
    );
  }
}

Captcha.propTypes = {
  error: React.PropTypes.any,
  input: React.PropTypes.any,
};
