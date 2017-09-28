import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import { setAuthState } from '../AccountProvider/actions';

import {
  makeSelectOpen,
  makeSelectActive,
  makeSelectIsMuted,
} from './selectors';
import {
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
} from '../AccountProvider/selectors';
import { makeStandingUpSelector } from '../Seat/selectors';
import {
  toggleMenuOpen,
  toggleMenuActive,
  mute,
  unmute,
} from './actions';
import {
  makeSitoutInProgressSelector,
} from '../Table/selectors';

import TableMenu from '../../components/TableMenu';

const TableMenuContainer = (props) => (
  <TableMenu
    disableOnClickOutside={!props.open}
    {...props}
  />
);
TableMenuContainer.propTypes = {
  open: React.PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  handleClickLogout: () => {
    browserHistory.push('/login');
    return dispatch(setAuthState({ loggedIn: false }));
  },
  toggleMenuOpen: () => dispatch(toggleMenuOpen()),
  toggleMenuActive: () => dispatch(toggleMenuActive()),
  handleClickMuteToggle: (toMute) => dispatch(toMute ? mute() : unmute()),
});

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  open: makeSelectOpen(),
  active: makeSelectActive(),
  blocky: makeBlockySelector(),
  nickName: makeNickNameSelector(),
  standingUp: makeStandingUpSelector(),
  sitoutInProgress: makeSitoutInProgressSelector(),
  isMuted: makeSelectIsMuted(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableMenuContainer);
