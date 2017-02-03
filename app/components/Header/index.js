import React from 'react';
import styled from 'styled-components';

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
    const navButtons = this.props.loggedIn ? ([
      <NavItem
        href="https://github.com"
        iconClass="fa fa-github"
        key="1"
        title="Github"
      />,
      <UserMenu
        name="Alexander Pierce"
        image="public/user2-160x160.jpg"
        profileAction={this.props.onClickLogout}
        signOutAction={this.props.onClickLogout}
        key="2"
      />,
    ]) : ([
      <NavItem
        href="/register"
        iconClass="fa fa-github"
        key="1"
        title="Register"
      />,
      <NavItem
        href="/login"
        iconClass="fa fa-github"
        key="2"
        title="Login"
      />,
    ]);

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
          loggedIn={this.props.loggedIn}
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

export default Header;
