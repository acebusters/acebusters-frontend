import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-recaptcha';
import { conf } from '../../app.config';

export default class Captcha extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      this.recaptcha.reset();
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '15px' }}>
        <ReCAPTCHA
          ref={(recaptcha) => { this.recaptcha = recaptcha; }}
          sitekey={conf().recaptchaKey}
          verifyCallback={this.props.input.onChange}
        />
      </div>
    );
  }
}

Captcha.propTypes = {
  error: PropTypes.any,
  input: PropTypes.any,
};
