import React from 'react';
import PropTypes from 'prop-types';
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
import { makeStandingUpSelector, makeMyPendingSelector } from '../Seat/selectors';
import {
  toggleMenuOpen,
  toggleMenuActive,
  mute,
  unmute,
} from './actions';
import {
  makeSitoutInProgressSelector,
  makeTableIsFullSelector,
  makeSbSelector,
} from '../Table/selectors';

import TableMenu from '../../components/TableMenu';

const TableMenuContainer = (props) => (
  <TableMenu
    disableOnClickOutside={!props.open}
    {...props}
  />
);
TableMenuContainer.propTypes = {
  open: PropTypes.bool,
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
  myPending: makeMyPendingSelector(),
  open: makeSelectOpen(),
  active: makeSelectActive(),
  blocky: makeBlockySelector(),
  nickName: makeNickNameSelector(),
  standingUp: makeStandingUpSelector(),
  sitoutInProgress: makeSitoutInProgressSelector(),
  isMuted: makeSelectIsMuted(),
  tableIsFull: makeTableIsFullSelector(),
  smallBlind: makeSbSelector(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableMenuContainer);
