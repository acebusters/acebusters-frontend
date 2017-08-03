import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSignerAddrSelector,
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
} from '../AccountProvider/selectors';

import { getHeaderCollapsed } from './selectors';
import { setCollapsed } from './actions';

import Header from '../../components/Header';

const HeaderContainer = (props) => (
  <Header
    disableOnClickOutside={props.collapsed}
    {...props}
  />
);

HeaderContainer.propTypes = {
  collapsed: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  signerAddr: makeSignerAddrSelector(),
  nickName: makeNickNameSelector(),
  blocky: makeBlockySelector(),
  collapsed: getHeaderCollapsed(),
});

export default connect(
  mapStateToProps,
  { setCollapsed },
)(HeaderContainer);
