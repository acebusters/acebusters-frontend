/**
 *
 * LoginProgressBar
 *
 */

import React, { PropTypes } from 'react';
import Wrapper from './Wrapper';
import Percent from './Percent';

class LoginProgressBar extends React.Component {

  static defaultProps = {
    loginProgress: -1,
  };

  render() {
    const percent = this.props.loginProgress;
    // Hide progress bar if percent is less than 0.
    const isHidden = percent < 0 || percent >= 100;
    // Set `state.percent` as width.
    const style = { width: `${(percent <= 0 ? 0 : percent)}%` };

    return (
      <Wrapper hidden={isHidden}>
        <Percent style={style} />
      </Wrapper>
    );
  }
}

LoginProgressBar.propTypes = {
  loginProgress: PropTypes.number,
};

export default LoginProgressBar;

