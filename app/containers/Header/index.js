import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createStructuredSelector } from 'reselect';
import {
  makeSignerAddrSelector,
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
} from '../AccountProvider/selectors';
import { setAuthState } from '../AccountProvider/actions';
import { getHeaderCollapsed } from './selectors';
import { setCollapsed } from './actions';

import Header from '../../components/Header';

const mapDispatchToProps = (dispatch) => ({
  onClickLogout: () => {
    browserHistory.push('/login');
    return dispatch(setAuthState({ loggedIn: false }));
  },
  setCollapsed: (val) => dispatch(setCollapsed(val)),
});

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  signerAddr: makeSignerAddrSelector(),
  nickName: makeNickNameSelector(),
  blocky: makeBlockySelector(),
  collapsed: getHeaderCollapsed(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
