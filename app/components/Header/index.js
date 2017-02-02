import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import HeaderLink from './HeaderLink';
import Button from '../Button';
import messages from './messages';
import Navbar from './Navbar';
import Logo from './Logo';
import UserMenu from './UserMenu';
import NavItem from './NavItem';


const StyledHeader = styled.header`
  /* clearfix */
  &:before, &:after {
    display: table;
    content: " ";
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  &:after {
    clear: both;
  }
  position: ${(props) => (props.fixed ? 'fixed' : 'relative')};
  width: ${(props) => (props.boxed ? '1024px' : '100%')};
  max-height: 100px;
  z-index: 1030;
  /* theme */
  ${(props) => props.theme.headerBoxShadow && `
    -webkit-box-shadow: ${props.theme.headerBoxShadow};
    box-shadow: ${props.theme.headerBoxShadow};
  `}
`;

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
      <StyledHeader fixed={this.props.fixed} >
        <Logo
          collapse={this.props.sidebarCollapse}
          sidebarMini={this.props.sidebarMini}
          onClick={this.props.logoOnClick}
          href={this.props.logoHref}
          logoLg={this.props.logoLg}
          logoSm={this.props.logoSm}
        />
        <Navbar
          toggle={this.props.sidebarToggle}
          collapse={this.props.sidebarCollapse}
          sidebarMini={this.props.sidebarMini}
        >
          {navButtons}
        </Navbar>
      </StyledHeader>
    );
  }
}

Header.propTypes = {
  fixed: React.PropTypes.bool,
  loggedIn: React.PropTypes.bool,
  logoOnClick: React.PropTypes.func,
  logoHref: React.PropTypes.string,
  logoLg: React.PropTypes.element,
  logoSm: React.PropTypes.element,
  sidebarMini: React.PropTypes.bool,
  sidebarCollapse: React.PropTypes.bool,
  sidebarToggle: React.PropTypes.func.isRequired,
  onClickLogout: React.PropTypes.func,
};

Header.defaultProps = {
  fixed: false,
  sidebarMini: false,
  sidebarCollapse: false,
  logoLg: <span><b>Ace</b>Busters</span>,
  logoSm: <span><b>A</b>B</span>,
};

Header.UserMenu = UserMenu;
Header.Item = NavItem;

export default Header;
