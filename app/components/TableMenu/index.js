import React from 'react';

import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';

import {
 Container,
 Logo,
 LogoWrapper,
 MenuContainer,
} from './styles';

const TableMenu = (props) => {
  const {
    loggedIn, open, myPos, sitout, handleClickLogout, onLeave, onSitout,
  } = props;
  const menuClose = [
    // Note: sitout value possibilities
    // sitout > 0, for enabled "play"
    // sitout === 0, for disabled "play"
    // sitout === undefined, for enabled "pause"
    // sitout === null, for disabled
    // myPos === -1, then not at table"pause"
    {
      name: 'sitout',
      icon: (typeof sitout === 'number') ? 'fa fa-play' : 'fa fa-pause',
      title: (typeof sitout === 'number') ? 'Sit-In' : 'Sit-Out',
      onClick: onSitout,
      disabled: myPos === undefined || sitout === 0 || sitout === null,
    },
    {
      name: 'standup',
      icon: 'fa fa-external-link',
      title: 'Stand-Up',
      onClick: onLeave,
      disabled: myPos === undefined,
      /* TODO add seatStatus to UI redux state and
        mapStateToProps in TableMenu container to be used here */
      // disabled: myPos === undefined ||
      //   seatStatus === STATUS_MSG.sittingIn ||
      //   seatStatus === STATUS_MSG.standingUp,
    },
  ];
  const menuUserOpen = [
    {
      name: 'lobby',
      icon: 'fa fa-search',
      title: 'Lobby',
      to: '/lobby',
      disabled: false,
    },
    {
      name: 'dashboard',
      icon: 'fa fa-tachometer',
      title: 'Dashboard',
      to: '/dashboard',
      disabled: false,
    },
    {
      name: 'preferences',
      icon: 'fa fa-cog',
      title: 'Preferences',
      onClick: () => {},
      disabled: true,
    },
    {
      name: 'logout',
      icon: 'fa fa-sign-out',
      title: 'Log-Out',
      onClick: () => handleClickLogout(),
      disabled: false,
    },
  ];
  const menuGuestOpen = [
    {
      name: 'lobby',
      icon: 'fa fa-search',
      title: 'Lobby',
      to: '/lobby',
      disabled: false,
    },
    {
      name: 'register',
      icon: 'fa fa-user-plus',
      title: 'Register',
      to: '/register',
      disabled: false,
    },
    {
      name: 'signin',
      icon: 'fa fa-sign-in',
      title: 'Log-In',
      to: '/login',
      disabled: false,
    },
  ];
  const renderMenu = () => {
    if (loggedIn && open) {
      return menuUserOpen;
    }
    if (!loggedIn && open) {
      return menuGuestOpen;
    }
    return menuClose;
  };
  return (
    <Container name="container">
      <LogoWrapper name="logo-wrapper">
        <Logo>AceBusters Logo</Logo>
      </LogoWrapper>
      <MenuContainer open={open} name="menu-container-guest">
        <MenuHeader {...props} />
        {renderMenu().map((item, index) => (
          <MenuItem key={index} item={item} {...props} />
        ))}
      </MenuContainer>
    </Container>
  );
};

TableMenu.propTypes = {
  loggedIn: React.PropTypes.bool,
  myPos: React.PropTypes.number,
  handleClickLogout: React.PropTypes.func,
  onLeave: React.PropTypes.func,
  sitout: React.PropTypes.any, // TODO change to only number
  onSitout: React.PropTypes.func,
  open: React.PropTypes.bool,
};

export default TableMenu;
