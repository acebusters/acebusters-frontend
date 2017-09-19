import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import Navbar from './Navbar';
import NavItem from './NavItem';

import {
  StyledHeader,
  NavToggle,
  StyledUserName,
  StyledUserImage,
} from './styles';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside() {
    if (!this.props.collapsed) {
      this.props.setCollapsed(true);
    }
  }

  render() {
    const toggleCollapsedMenu = () => this.props.setCollapsed(!this.props.collapsed);
    const navButtons = this.props.loggedIn ? ([
      <NavToggle
        onClick={toggleCollapsedMenu}
        key="nav-toggle"
      >
        <i className="fa fa-bars fa-2"></i>
      </NavToggle>,
      <NavItem
        to="lobby"
        collapsed={this.props.collapsed}
        key="2"
        title="Lobby"
        location={this.props.location}
      />,
      <NavItem
        to="dashboard"
        key="3"
        collapsed={this.props.collapsed}
        title={<span>
          <StyledUserImage src={this.props.blocky} />
          <StyledUserName>{this.props.nickName}</StyledUserName>
        </span>}
        location={this.props.location}
      />,
      <NavItem
        onClick={this.props.onClickLogout}
        key="4"
        collapsed={this.props.collapsed}
        title="Sign Out"
      />,
    ]) : ([
      <NavItem
        collapseOnMobile={false}
        to="/register"
        key="1"
        title="Register"
        location={this.props.location}
      />,
      <NavItem
        collapseOnMobile={false}
        to="/login"
        key="2"
        title="Login"
        location={this.props.location}
      />,
    ]);
    return (
      <StyledHeader
        onMouseLeave={this.handleClickOutside}
        fixed={this.props.fixed}
        id="header"
      >
        <Navbar loggedIn={this.props.loggedIn}>
          {navButtons}
        </Navbar>
      </StyledHeader>
    );
  }
}

Header.propTypes = {
  fixed: PropTypes.bool,
  location: PropTypes.object,
  loggedIn: PropTypes.bool,
  onClickLogout: PropTypes.func,
  setCollapsed: PropTypes.func,
  collapsed: PropTypes.bool,
  nickName: PropTypes.string,
  blocky: PropTypes.string,
};

Header.defaultProps = {
  fixed: false,
  sidebarMini: false,
  logoLg: <span><b>Ace</b>Busters</span>,
  logoSm: <span><b>A</b>B</span>,
};

export default onClickOutside(Header);
