import React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

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
        iconClass="fa fa-dashboard"
        onClick={() => browserHistory.push('/dashboard')}
        key="2"
        title="Dashboard"
      />,
      <NavItem
        iconClass="fa fa-group"
        onClick={() => browserHistory.push('/lobby')}
        key="3"
        title="Lobby"
      />,
      <UserMenu
        name="Alexander Pierce"
        image={this.props.imageUrl}
        profileAction={() => browserHistory.push('/dashboard')}
        signOutAction={this.props.onClickLogout}
        key="4"
      />,
    ]) : ([
      <NavItem
        onClick={() => browserHistory.push('/register')}
        iconClass="fa fa-user-plus"
        key="1"
        title="Register"
      />,
      <NavItem
        onClick={() => browserHistory.push('/login')}
        iconClass="fa fa-sign-in"
        key="2"
        title="Login"
      />,
    ]);

    return (
      <StyledHeader fixed={this.props.fixed} id="header">
        <Logo
          href={this.props.logoHref}
          logoLg={this.props.logoLg}
          logoSm={this.props.logoSm}
        />
        <Navbar
          loggedIn={this.props.loggedIn}
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
  logoHref: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
  logoLg: React.PropTypes.element,
  logoSm: React.PropTypes.element,
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
