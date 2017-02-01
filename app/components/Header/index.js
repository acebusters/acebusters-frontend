import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import Button from '../Button';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const navButtons = this.props.loggedIn ? (
      <div>
        <HeaderLink to="/features">
          <FormattedMessage {...messages.features} />
        </HeaderLink>
        <Button onClick={this.props.onClickLogout}>
          <FormattedMessage {...messages.logout} />
        </Button>
      </div>
    ) : (
      <div>
        <HeaderLink to="/register">
          <FormattedMessage {...messages.register} />
        </HeaderLink>
        <HeaderLink to="/login">
          <FormattedMessage {...messages.login} />
        </HeaderLink>
      </div>
    );
    return (
      <div>
        <A href="https://twitter.com/mxstbr">
          <Img src={Banner} alt="react-boilerplate - Logo" />
        </A>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          {navButtons}
        </NavBar>
      </div>
    );
  }
}

Header.propTypes = {
  loggedIn: React.PropTypes.boolean,
  onClickLogout: React.PropTypes.func,
};

export default Header;
