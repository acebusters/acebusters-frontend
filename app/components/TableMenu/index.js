import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';

import {
 LogoWrapper,
 TableLogoContainer,
 MenuContainer,
} from './styles';

import {
  Logo,
  LogoName,
  NameContainer,
} from '../Logo';

class TableMenu extends React.Component {
  handleClickOutside() {
    // only close the menu if it is already open
    if (this.props.open) {
      this.props.toggleMenuOpen();
    }
  }
  render() {
    const {
      loggedIn, open, myPos, sitout, handleClickLogout, onLeave, onSitout,
      standingUp, myLastReceipt, state, sitoutInProgress,
    } = this.props;
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
        disabled: myPos === undefined || sitout === 0 || sitout === null ||
                  standingUp || sitoutInProgress !== undefined ||
                  // player can't sit-in in the hand he sit-out after game started
                  (
                    typeof sitout === 'number' &&
                    sitout > 0 &&
                    myLastReceipt &&
                    state !== 'waiting' &&
                    state !== 'dealing'
                  ),
      },
      {
        name: 'standup',
        icon: 'fa fa-external-link',
        title: 'Stand-Up',
        onClick: onLeave,
        disabled: myPos === undefined || standingUp || sitoutInProgress !== undefined,
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
      <div>
        <LogoWrapper name="logo-wrapper">
          <TableLogoContainer>
            <Logo />
          </TableLogoContainer>
          <NameContainer>
            <LogoName name="logo-name" />
          </NameContainer>
        </LogoWrapper>
        <MenuContainer open={open} name="menu-container">
          <MenuHeader {...this.props} />
          {renderMenu().map((item, index) => (
            <MenuItem key={index} item={item} {...this.props} />
          ))}
        </MenuContainer>
      </div>
    );
  }
}

TableMenu.propTypes = {
  loggedIn: PropTypes.bool,
  myPos: PropTypes.number,
  handleClickLogout: PropTypes.func,
  onLeave: PropTypes.func,
  sitout: PropTypes.any, // TODO change to only number
  onSitout: PropTypes.func,
  toggleMenuOpen: PropTypes.func,
  open: PropTypes.bool,
  standingUp: PropTypes.bool,
  myLastReceipt: PropTypes.object,
  state: PropTypes.string,
  sitoutInProgress: PropTypes.number,
};

export default onClickOutside(TableMenu);
