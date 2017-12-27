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

// Note: sitout value possibilities
// sitout > 0, for enabled "play"
// sitout === 0, for disabled "play"
// sitout === undefined, for enabled "pause"
// sitout === null, for disabled
// myPos === -1, then not at table"pause"
function isSioutDisabled(props) {
  const {
    sitout, standingUp, sitoutInProgress,
    myPos, myPending, myLastReceipt, myStack,
    state, smallBlind,
  } = props;
  const isSitoutFlag = typeof sitout === 'number';
  const bb = (smallBlind || 0) * 2;
  return (
    myPending ||
    myPos === undefined ||
    sitout === 0 || sitout === null ||
    standingUp || sitoutInProgress !== undefined ||
    (isSitoutFlag && (!myStack || myStack < bb || myStack <= 0)) || // player can't sit-in if his balance is empty
    // player can't sit-in in the hand he sit-out after game started
    (
      isSitoutFlag &&
      sitout > 0 &&
      myLastReceipt &&
      state !== 'waiting' &&
      state !== 'dealing'
    )
  );
}

function isStadingUpDisabled(props) {
  const { myPos, standingUp, sitoutInProgress, myPending } = props;
  /* TODO add seatStatus to UI redux state and
    mapStateToProps in TableMenu container to be used here */
  // disabled: myPos === undefined ||
  //   seatStatus === STATUS_MSG.sittingIn ||
  //   seatStatus === STATUS_MSG.standingUp,
  return myPending || myPos === undefined || standingUp || sitoutInProgress !== undefined;
}

class TableMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calledOpponent: false,
    };

    this.handleOpponentCall = this.handleOpponentCall.bind(this);
  }

  handleClickOutside() {
    // only close the menu if it is already open
    if (this.props.open) {
      this.props.toggleMenuOpen();
    }
  }

  handleOpponentCall() {
    if (typeof this.props.onCallOpponent === 'function') {
      this.props.onCallOpponent();
      this.setState({ calledOpponent: true });
      setTimeout(() => {
        this.setState({ calledOpponent: false });
      }, 5 * 60 * 1000);
    }
  }

  render() {
    const {
      loggedIn, open, sitout, isMuted, standingUp,
      handleClickLogout, onLeave, onSitout, handleClickMuteToggle,
      myPos, myPending, tableIsFull,
    } = this.props;
    const { calledOpponent } = this.state;

    const isSitoutFlag = typeof sitout === 'number';
    const menuClose = [
      {
        name: 'mute',
        icon: `fa ${isMuted ? 'fa-volume-off' : 'fa-volume-up'}`,
        title: isMuted ? 'Unmute' : 'Mute',
        onClick: () => handleClickMuteToggle(!isMuted),
        disabled: false,
      },
      {
        name: 'sitout',
        icon: isSitoutFlag ? 'fa fa-play' : 'fa fa-pause',
        title: isSitoutFlag ? 'Sit-In' : 'Sit-Out',
        onClick: onSitout,
        disabled: isSioutDisabled(this.props),
      },
      {
        name: 'standup',
        icon: 'fa fa-external-link',
        title: 'Stand-Up',
        onClick: onLeave,
        pending: standingUp,
        disabled: isStadingUpDisabled(this.props),
      },
    ];

    if (!calledOpponent) {
      menuClose.push({
        name: 'call-opponent',
        icon: 'fa fa-bullhorn',
        title: 'Call an opponent',
        onClick: this.handleOpponentCall,
        disabled: tableIsFull || standingUp || myPending || myPos === undefined,
      });
    }

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
      <div name="table-menu">
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
  handleClickLogout: PropTypes.func,
  onLeave: PropTypes.func,
  sitout: PropTypes.any, // TODO change to only number
  onSitout: PropTypes.func,
  toggleMenuOpen: PropTypes.func,
  open: PropTypes.bool,
  isMuted: PropTypes.bool,
  standingUp: PropTypes.bool,
  handleClickMuteToggle: PropTypes.func,
  onCallOpponent: PropTypes.func,
  myPos: PropTypes.number,
  smallBlind: PropTypes.number, // eslint-disable-line
  myPending: PropTypes.bool,
  tableIsFull: PropTypes.bool,
};

export default onClickOutside(TableMenu);
