import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';

import {
 LogoWrapper,
 MenuContainer,
} from './styles';

import { Logo } from '../Logo';
import Link from '../Link';

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
      standingUp, myLastReceipt, state, sitoutInProgress, myStack, isMuted,
      handleClickMuteToggle,
    } = this.props;
    const isSitoutFlag = typeof sitout === 'number';
    const menuClose = [
      // Note: sitout value possibilities
      // sitout > 0, for enabled "play"
      // sitout === 0, for disabled "play"
      // sitout === undefined, for enabled "pause"
      // sitout === null, for disabled
      // myPos === -1, then not at table"pause"
      {
        name: 'sitout',
        icon: isSitoutFlag ? 'fa fa-play' : 'fa fa-pause',
        title: isSitoutFlag ? 'Sit-In' : 'Sit-Out',
        onClick: onSitout,
        disabled: myPos === undefined || sitout === 0 || sitout === null ||
                  standingUp || sitoutInProgress !== undefined ||
                  (isSitoutFlag && !myStack) || // player can't sit-in if his balance is empty
                  // player can't sit-in in the hand he sit-out after game started
                  (
                    isSitoutFlag &&
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
      {
        name: 'mute',
        icon: `fa ${isMuted ? 'fa-volume-off' : 'fa-volume-up'}`,
        title: isMuted ? 'Unmute' : 'Mute',
        onClick: () => handleClickMuteToggle(!isMuted),
        disabled: false,
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
          <Link to="/">
            <Logo />
          </Link>
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
  myStack: PropTypes.number,
  isMuted: PropTypes.bool,
  handleClickMuteToggle: PropTypes.func,
};

export default onClickOutside(TableMenu);
