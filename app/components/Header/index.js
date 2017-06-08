import React from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import Navbar from './Navbar';
import UserMenu from './UserMenu';
import NavItem from './NavItem';

import {
  screenXsMax,
} from '../../variables';

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
  width: 100%;
  max-height: 50px;
  z-index: 1030;
  /* theme */
  ${(props) => props.theme.headerBoxShadow && `
    -webkit-box-shadow: ${props.theme.headerBoxShadow};
    box-shadow: ${props.theme.headerBoxShadow};
  `}
`;

const NavToggle = styled.button`
  position: relative;
  float: right;
  padding: 9px 10px;
  margin-top: 8px;
  margin-right: 15px;
  margin-bottom: 8px;
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  @media (min-width: ${screenXsMax}) {
    display: none;
  }
`;

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.toggleCollapsedMenu = this.toggleCollapsedMenu.bind(this);
  }

  toggleCollapsedMenu() {
    const collapsed = (this.state) ? !this.state.toggleCollapsed : false;
    this.setState({ toggleCollapsed: collapsed });
  }

  render() {
    const collapsed = (this.state) ? this.state.toggleCollapsed : true;
    const navButtons = this.props.loggedIn ? ([
      <NavToggle
        onClick={this.toggleCollapsedMenu}
        key="nav-toggle"
      >
        <i className="fa fa-bars fa-2"></i>
      </NavToggle>,
      <NavItem
        onClick={() => browserHistory.push('/dashboard')}
        collapsed={collapsed}
        key="2"
        title="Dashboard"
        location={this.props.location}
      />,
      <NavItem
        onClick={() => browserHistory.push('/lobby')}
        key="3"
        collapsed={collapsed}
        title="Lobby"
        location={this.props.location}
      />,
      <UserMenu
        profileAction={() => browserHistory.push('/dashboard')}
        signOutAction={this.props.onClickLogout}
        collapsed={collapsed}
        key="4"
        {...this.props}
      />,
    ]) : ([
      <NavItem
        onClick={() => browserHistory.push('/register')}
        key="1"
        title="Register"
        location={this.props.location}
      />,
      <NavItem
        onClick={() => browserHistory.push('/login')}
        key="2"
        title="Login"
        location={this.props.location}
      />,
    ]);
    return (
      <StyledHeader fixed={this.props.fixed} id="header">
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
  location: React.PropTypes.object,
  loggedIn: React.PropTypes.bool,
  onClickLogout: React.PropTypes.func,
};

Header.defaultProps = {
  fixed: false,
  sidebarMini: false,
  logoLg: <span><b>Ace</b>Busters</span>,
  logoSm: <span><b>A</b>B</span>,
};

export default Header;
