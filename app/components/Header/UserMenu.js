/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import {
  StyledUserImage,
  StyledUserName,
  UserMenuHeader,
  UserMenuHeaderImage,
  UserMenuHeaderName,
  UserFooterButton,
  UserFooter,
  UserDropDown,
  StyledUserMenu,
} from './styles';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      open: !this.state.open,
    });
  }

  closeMenu() {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <StyledUserMenu onClick={this.toggleMenu} onMouseLeave={this.closeMenu} collapsed={this.props.collapsed}>
        <StyledUserImage src={this.props.blocky} />
        <StyledUserName>{this.props.nickName}</StyledUserName>
        <UserDropDown open={this.state.open} >
          <UserMenuHeader>
            <UserMenuHeaderImage src={this.props.blocky} />
            <UserMenuHeaderName>{this.props.nickName}</UserMenuHeaderName>
            <UserMenuHeaderName>{this.props.signerAddr}</UserMenuHeaderName>
          </UserMenuHeader>
          <UserFooter>
            {this.props.profileAction &&
              <div style={{ float: 'left' }}>
                <UserFooterButton onClick={this.props.profileAction}>Profile</UserFooterButton>
              </div>}
            {this.props.signOutAction &&
              <div style={{ float: 'right' }}>
                <UserFooterButton onClick={this.props.signOutAction}>Sign Out</UserFooterButton>
              </div>}
          </UserFooter>
        </UserDropDown>
      </StyledUserMenu>
    );
  }
}

UserMenu.propTypes = {
  nickName: React.PropTypes.string,
  blocky: React.PropTypes.string,
  signerAddr: React.PropTypes.string,
  collapsed: React.PropTypes.bool,
  profileAction: React.PropTypes.func,
  signOutAction: React.PropTypes.func,
};

export default UserMenu;
